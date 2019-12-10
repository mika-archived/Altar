// @ts-check
const aws = require("aws-sdk");

/**
 * @typedef {Object} File
 * @property {string} name
 * @property {string} content
 */

/**
 * @typedef {Object} Payload
 * @property {string} id
 * @property {string} executor
 * @property {File[]} files
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
 * @param {any} event
 * @param {import("aws-lambda").Context} _context
 */

const handler = async (event, _context) => {
  /** @type {Payload} */
  const json = event.body;
  json.id = uuid(); // new generated unique id

  const ecs = new aws.ECS();

  try {
    await runPerlInstaller(ecs, json);

    return { status: "success", state: json };
  } catch (err) {
    console.error(err);
    return { status: "fail", reason: err };
  }
};

exports.handler = handler;
