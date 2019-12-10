// @ts-check
const aws = require("aws-sdk");

/**
 * @typedef {Object} Payload
 * @property {string} id
 */

/**
 * @param {any} event
 * @param {import("aws-lambda").Context} _context
 */

const handler = async (event, _context) => {
  /** @type {Payload} */
  const json = event.state;

  const ecs = new aws.ECS();

  try {
    return { status: "success", state: json };
  } catch (err) {
    console.error(err);
    return { status: "fail", reason: err };
  }
};

exports.handler = handler;
