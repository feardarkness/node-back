const readBody = require('./read-body');

const jsonBodyParser = async (req, res, next) => {
  let body = await readBody(req);
  req.body = JSON.parse(body);
  next();
};

module.exports = jsonBodyParser;
