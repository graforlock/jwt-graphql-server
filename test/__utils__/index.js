exports.typeOf = obj =>
  Object.prototype.toString
    .call(obj)
    .match(/^\[object\s(.*)\]$/)[1];

exports.delay = ms => new Promise(resolve => setTimeout(resolve, ms));
