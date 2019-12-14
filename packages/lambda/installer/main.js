// @ts-check
const aws = require("aws-sdk");

const EXECUTORS = ["5.30.1"];

/**
 * @typedef {Object} File
 * @property {string} name
 * @property {string} content
 */

/**
 * @typedef {Object} Payload
 * @property {string} id
 * @property {string[]} dependencies
 * @property {string} executor
 * @property {File[]} files
 * @property {string} title
 */

/**
 * see also: https://gist.github.com/jcxplorer/823878
 * @returns {string}
 */
const uuid = () => {
  let uuid = "";
  let random;

  for (let i = 0; i < 32; i++) {
    random = (Math.random() * 16) | 0;

    if (i === 8 || i === 12 || i === 16 || i === 20) uuid += "-";
    uuid += (i === 12 ? 4 : i === 16 ? (random & 3) | 8 : random).toString(16);
  }

  return uuid;
};

/**
 * @param {string} str
 * @returns {number}
 */
const bytes = str => {
  return escape(encodeURIComponent(str)).length;
};

/**
 * @param {number} ms
 * @returns {Promise<void>}
 */
const waitAsync = ms => {
  return new Promise((resolve, _) => {
    setTimeout(() => resolve(), ms);
  });
};

/**
 * @param {import("aws-sdk").ECS} ecs
 * @param {import("aws-sdk").ECS.RunTaskRequest} params
 * @returns {Promise<import("aws-sdk").ECS.RunTaskResponse>}
 */
const runTaskAsync = (ecs, params) => {
  return new Promise((resolve, reject) => {
    ecs.runTask(params, (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
};

/**
 * @param {import("aws-sdk").ECS} ecs
 * @param {import("aws-sdk").ECS.DescribeTasksRequest} params
 * @returns {Promise<import("aws-sdk").ECS.DescribeTasksResponse>}
 */
const describeTasksAsync = (ecs, params) => {
  return new Promise((resolve, reject) => {
    ecs.describeTasks(params, (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
};

/**
 * @param {import("aws-sdk").ECS} ecs
 * @param {Payload} json
 * @returns {Promise}
 */
const runPerlInstaller = async (ecs, json) => {
  /** @type {import("aws-sdk").ECS.RunTaskRequest} */
  const taskRequestParams = {
    cluster: "AltarCluster",
    count: 1,
    launchType: "EC2",
    overrides: {
      containerOverrides: [
        {
          name: "perl-installer",
          command: ["/usr/local/altar/installer/bin/startup.sh"],
          environment: [
            { name: "ALTAR_PROJECT", value: JSON.stringify(json) },
            { name: "PERL_CARMEL_REPO", value: "/usr/local/PROJECT/caches" }
          ]
        }
      ]
    },
    taskDefinition: `AltarPerlInstaller:9`
  };

  try {
    const taskResponse = await runTaskAsync(ecs, taskRequestParams);
    if (taskResponse.failures.length > 0)
      return Promise.reject(`task execution failed because ${taskResponse.failures.map(w => w.reason).join(", ")}`);

    const task = taskResponse.tasks[0];

    let status = "PENDING";
    do {
      await waitAsync(1000);

      /** @type {import("aws-sdk").ECS.DescribeTasksRequest} */
      const describeRequestParams = {
        cluster: "AltarCluster",
        tasks: [task.taskArn]
      };

      const describeResponse = await describeTasksAsync(ecs, describeRequestParams);
      if (describeResponse.failures.length > 0)
        return Promise.reject(
          `task execution failed because ${describeResponse.failures.map(w => w.reason).join(", ")}`
        );

      status = describeResponse.tasks[0].desiredStatus;
    } while (status !== "STOPPED");
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
  if (!json.executor || json.executor.length === 0 || !EXECUTORS.includes(json.executor)) return false;

  // files is null, empty
  if (!json.files || json.files.length === 0) return false;

  // files has duplicated name(s)
  const filenames = json.files.map(w => w.name);
  if (filenames.filter((w, i) => filenames.indexOf(w) !== i).length > 0) return false;

  // dependencies has duplicated name(s)
  const dependencies = json.dependencies || [];
  if (dependencies.filter((w, i) => dependencies.indexOf(w) !== i).length > 0) return false;

  // or too larger (max 100KB)
  if (bytes(json.files.map(w => w.content).join("")) / 1024 >= 100) return false;

  return true;
};

/**
 * @param {any} event
 * @param {import("aws-lambda").Context} _context
 */
const handler = async (event, _context) => {
  /** @type {Payload} */
  const json = event.body;
  if (!validate(json)) return { status: "fail", reason: "invalid request body", state: json };

  json.id = uuid(); // new generated unique id

  const ecs = new aws.ECS();

  try {
    await runPerlInstaller(ecs, json);

    return { status: "success", state: json };
  } catch (err) {
    console.error(err);
    return { status: "fail", reason: err, state: json };
  }
};

exports.handler = handler;
