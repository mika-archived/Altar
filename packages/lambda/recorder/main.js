// @ts-check
const aws = require("aws-sdk");

/**
 * @typedef {Object} Dependency
 * @property {string} name
 * @property {string} version
 */

/**
 * @typedef {Object} File
 * @property {string} name
 * @property {string} content
 */

/**
 * @typedef {Object} Payload
 * @property {string} id
 * @property {Dependency[]} dependencies
 * @property {string} executor
 * @property {File[]} files
 * @property {string} taskArn
 * @property {string} title
 */

/** @type {Dependency[]} */
const NO_DEPENDENCIES = [{ name: "(none)", version: null }];

/**
 * @param {string} str
 * @returns {number}
 */
const bytes = str => {
  return escape(encodeURIComponent(str)).length;
};

/**
 * @param {import("aws-sdk").CloudWatchLogs} cw
 * @param {import("aws-sdk").CloudWatchLogs.GetLogEventsRequest} params
 * @returns {Promise<import("aws-sdk").CloudWatchLogs.GetLogEventsResponse>}
 */
const getLogEventsAsync = async (cw, params) => {
  return new Promise((resolve, reject) => {
    cw.getLogEvents(params, (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
};

/**
 * @param {import("aws-sdk").DynamoDB} db
 * @param {import("aws-sdk").DynamoDB.PutItemInput} params
 * @returns {Promise<import("aws-sdk").DynamoDB.PutItemOutput>}
 */
const putItemAsync = async (db, params) => {
  return new Promise((resolve, reject) => {
    db.putItem(params, (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
};

/**
 * @param {string} taskArn
 * @return {Promise<string>}
 */
const getLogsAsync = async taskArn => {
  const cw = new aws.CloudWatchLogs();

  /** @type {import("aws-sdk").CloudWatchLogs.GetLogEventsRequest} */
  const params = {
    logGroupName: "/ecs/AltarPerlExecutor",
    logStreamName: `ecs/perl-executor/${taskArn}`,
    limit: 50
  };

  try {
    const { events } = await getLogEventsAsync(cw, params);
    const logs = events.map(w => w.message).join("\n");

    // stdout/stderr is limited to 100KB
    if (bytes(logs) / 1024 >= 100) return "TRASHED";
    return logs;
  } catch (err) {
    return Promise.reject(err);
  }
};

/**
 * @param {Payload} json
 * @param {string} logs
 * @returns {Promise}
 */
const insertBuild = async (json, logs) => {
  const db = new aws.DynamoDB();

  /** @type {import("aws-sdk").DynamoDB.PutItemInput} */
  const params = {
    TableName: "Altar",
    Item: {
      id: { S: json.id },
      executor: { S: json.executor },
      dependencyNames: { SS: (json.dependencies || NO_DEPENDENCIES).map(w => w.name) },
      dependencyVersions: { SS: (json.dependencies || NO_DEPENDENCIES).map(w => w.version || "(unspecified)") },
      fileContents: { SS: json.files.map(w => w.content) },
      fileTitles: { SS: json.files.map(w => w.name) },
      title: { S: json.title || "notitle" },
      out: { S: logs }
    }
  };

  try {
    await putItemAsync(db, params);
  } catch (err) {
    return Promise.reject(err);
  }
};

/**
 * @param {Payload} json
 * @returns {boolean}
 */
const validate = json => {
  // executor is null, empty or invalid
  if (!json.executor || json.executor.length === 0) return false;

  // files is null, empty
  if (!json.files || json.files.length === 0) return false;

  // task ARN is null, empty
  if (!json.taskArn || json.taskArn.length === 0) return false;

  return true;
};

/**
 * @param {any} event
 * @param {import("aws-lambda").Context} _
 */
const handler = async (event, _) => {
  /** @type {Payload} */
  const json = event.state;
  if (!validate(json)) return { status: "fail", reason: "invalid request body" };

  try {
    const logs = await getLogsAsync(json.taskArn);
    await insertBuild(json, logs);

    return { status: "success", state: { ...json, logs } };
  } catch (err) {
    console.error(err);
    return { status: "fail", reason: err };
  }
};

exports.handler = handler;
