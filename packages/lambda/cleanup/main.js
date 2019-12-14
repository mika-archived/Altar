// @ts-check
const aws = require("aws-sdk");

/**
 * @typedef {Object} Payload
 * @property {string} id
 */

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
 * @param {Payload} json
 * @returns {Promise<void>}
 */
const runPerlCleaner = async (ecs, json) => {
  /** @type {import("aws-sdk").ECS.RunTaskRequest } */
  const taskRequestParams = {
    cluster: "AltarCluster",
    count: 1,
    launchType: "EC2",
    overrides: {
      containerOverrides: [
        {
          name: "perl-cleaner",
          command: ["/usr/local/altar/cleaner/bin/startup.sh"],
          environment: [{ name: "ALTAR_PROJECT", value: JSON.stringify(json) }]
        }
      ]
    },
    taskDefinition: `AltarPerlCleaner:1`
  };

  try {
    const taskResponse = await runTaskAsync(ecs, taskRequestParams);
    if (taskResponse.failures.length > 0)
      return Promise.reject(`task execution failed because ${taskResponse.failures.map(w => w.reason).join(", ")}`);
  } catch (err) {
    return Promise.reject(err);
  }
};

/**
 * @param {any} event
 * @param {import("aws-lambda").Context} _context
 */
const handler = async (event, _context) => {
  /** @type {Payload} */
  const json = event.state;
  if (!json.id) return { status: "fail", reason: "no id specified", state: json };

  const ecs = new aws.ECS();

  try {
    await runPerlCleaner(ecs, json);

    return { status: "success", state: json };
  } catch (err) {
    console.error(err);
    return { status: "fail", reason: err, state: json };
  }
};

exports.handler = handler;
