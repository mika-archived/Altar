exports.handler = (event, context, callback) => {
  var request = event.Records[0].cf.request;
  request.uri = request.uri.replace(/^\/internal\//, "/");
  console.log("rewrite to " + request.uri);

  callback(null, request);
};
