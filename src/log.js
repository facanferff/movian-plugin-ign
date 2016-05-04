function logData(data, logFunction, depth) {
  if (!depth) depth = 0;

  var body = "";
  for (var i = 0; i < depth; i++) body += "  ";
  if (depth > 0) body += "'-> ";

  if (data === null) logFunction(body + "NULL");
  else if (data === undefined) logFunction(body + "UNDEFINED");
  else if (typeof (data) === 'boolean') logFunction(body + data);
  else if (typeof (data) === 'number') logFunction(body + data);
  else if (typeof (data) === 'string') logFunction(body + data);
  else if (Array.isArray(data)) logFunction(JSON.stringify(data, null, 4));
  else if (typeof (data) === 'object') logFunction(JSON.stringify(data, null, 4));
  else if (typeof (data) === 'function') logFunction(body + "Function()");
  else logFunction(body + "Unknown data type");
}

exports.d = function (data) {
  logData(data, console.log);
};

exports.e = function (data) {
  logData(data, console.error);
};
