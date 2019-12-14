// @ts-check
const aws = require("aws-sdk");

/**
 * @param {string} id
 * @returns {Promise<import("aws-sdk").DynamoDB.GetItemOutput>}
 */
const fetchItem = async id => {
  const db = new aws.DynamoDB();

  return new Promise((resolve, reject) => {
    db.getItem({ TableName: "Altar", Key: { id: { S: id } } }, (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
};

/**
 * @param {import("aws-lambda").APIGatewayEvent} event
 * @param {import("aws-lambda").Context} context
 */
const handler = async (event, context) => {
  const { id } = event.pathParameters;

  try {
    const { Item } = await fetchItem(id);

    const files = [];
    for (let i = 0; i < Item["fileTitles"].SS.length; i++)
      files.push({ name: Item["fileTitles"].SS[i], content: Item["fileContents"].SS[i] });

    return context.done(null, {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        id,
        dependencies: Item["dependencies"].SS,
        executor: Item["executor"].S,
        files,
        out: Item["out"].S,
        status: "success",
        title: Item["title"].S
      })
    });
  } catch (err) {
    return context.fail(err);
  }
};

exports.handler = handler;
