// @ts-check
const aws = require("aws-sdk");

/**
 * @typedef {Object} Payload
 * @property {string} id
 * @property {string} executor
 */

/**
 * @param {*} ms
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
 * @param {import("aws-sdk").ECS.RegisterTaskDefinitionRequest} params
 * @returns {Promise<import("aws-sdk").ECS.RegisterTaskDefinitionResponse>}
 */
const createTaskDefinitionAsync = (ecs, params) => {
  return new Promise((resolve, reject) => {
    ecs.registerTaskDefinition(params, (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
};

/**
 * @param {import("aws-sdk").ECS} ecs
 * @param {import("aws-sdk").ECS.DeregisterTaskDefinitionRequest} params
 * @returns {Promise<import("aws-sdk").ECS.DeregisterTaskDefinitionResponse>}
 */
const destroyTaskDefinitionAsync = (ecs, params) => {
  return new Promise((resolve, reject) => {
    ecs.deregisterTaskDefinition(params, (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
};

/**
 * @param {import("aws-sdk").ECS} ecs
 * @param {Payload} json
 * @returns {Promise<number>}
 */
const createExecutorTaskDefinitionAsync = async (ecs, json) => {
  /** @type {import("aws-sdk").ECS.RegisterTaskDefinitionRequest} */
  const taskDefinitionParams = {
    family: "AltarPerlExecutor",
    containerDefinitions: [
      {
        name: "perl-executor",
        image: `perl:${json.executor}`,
        cpu: 128,
        memory: 128,
        essential: true,
        command: ["timeout", "60", "perl", "main.pl"],
        environment: [{ name: "PERL5LIB", value: "./local/lib/perl5:./lib" }],
        workingDirectory: `/usr/local/PROJECT/workspace`,
        mountPoints: [
          {
            containerPath: `/usr/local/PROJECT/workspace`,
            sourceVolume: "altar-workspace"
          }
        ],
        logConfiguration: {
          logDriver: "awslogs",
          options: {
            "awslogs-group": "/ecs/AltarPerlExecutor",
            "awslogs-region": "ap-northeast-1",
            "awslogs-stream-prefix": "ecs"
          }
        }
      }
    ],
    networkMode: "none",
    requiresCompatibilities: ["EC2"],
    volumes: [
      {
        name: "altar-workspace",
        host: { sourcePath: `/mnt/efs/altar/workspace/${json.id}` }
      }
    ]
  };

  try {
    const task = await createTaskDefinitionAsync(ecs, taskDefinitionParams);
    if (!task.taskDefinition) return Promise.reject(`task creation failed`);

    return task.taskDefinition.revision;
  } catch (err) {
    return Promise.reject(err);
  }
};

/**
 * @param {import("aws-sdk").ECS} ecs
 * @param {number} revision
 */
const destroyExecutorTaskDefinitionAsync = async (ecs, revision) => {
  /** @type {import("aws-sdk").ECS.DeregisterTaskDefinitionRequest} */
  const taskDefinitionParams = {
    taskDefinition: `AltarPerlExecutor:${revision}`
  };

  try {
    await destroyTaskDefinitionAsync(ecs, taskDefinitionParams);
  } catch (err) {
    return Promise.reject(err);
  }
};

/**
 * @param {import("aws-sdk").ECS} ecs
 * @param {number} revision
 * @returns {Promise<string>}
 */
const runPerlExecutor = async (ecs, revision) => {
  console.log(revision);
  /** @type {import("aws-sdk").ECS.RunTaskRequest} */
  const taskRequestParams = {
    cluster: "AltarCluster",
    count: 1,
    launchType: "EC2",
    taskDefinition: `AltarPerlExecutor:${revision}`
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

      return task.taskArn.split("/")[1];
    } while (status !== "STOPPED");
  } catch (err) {
    return Promise.reject(err);
  }
};

/**
 * @param {any} event
 * @param {import("aws-lambda").Context} context
 */
const handler = async (event, context) => {
  /** @type {Payload} */
  const json = event.state;
  if (!json.id || !json.executor) return { status: "fail", reason: "invalid request body", state: json };

  const ecs = new aws.ECS();

  try {
    const revision = await createExecutorTaskDefinitionAsync(ecs, json);
    const taskArn = await runPerlExecutor(ecs, revision);
    await destroyExecutorTaskDefinitionAsync(ecs, revision);

    return { status: "success", state: { ...json, taskArn } };
  } catch (err) {
    console.error(err);
    return { status: "fail", reason: err, state: json };
  }
};

exports.handler = handler;
