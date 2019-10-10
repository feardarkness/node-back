const { stringify } = require('csv');
const builder = require('xmlbuilder');

const respondWithCsv = (req, res, data) => {
  res.type('text/csv')
  stringify(data)
    .pipe(res);
};

const respondWithXml = (req, res, data) => {
  res.type('application/xml')
  const xmlUsers = builder.create({ root: { users: data } }).end({ pretty: true });
  res.send(xmlUsers);
};

const respondWithJson = (req, res, data) => {
  res.send(data);
};

module.exports = {
  respondWithCsv,
  respondWithJson,
  respondWithXml,
};