const express = require('express');
const emails = require('../fixtures/emails');
const { respondWithCsv, respondWithJson, respondWithXml } = require('../helpers/formatters');

const responsesByType = {
  'text/csv': respondWithCsv,
  'application/xml': respondWithXml,
};

const getEmailsRoute = (req, res) => {
  const type = req.accepts();
  const respond = responsesByType[type] || respondWithJson;
  respond(req, res, emails);
};

let getEmailRoute = (req, res) => {
  let email = emails.find(email => email.id === req.params.id);
  res.send(email);
};

const emailsRouter = express.Router();

emailsRouter.get('/', getEmailsRoute);
emailsRouter.get('/:id', getEmailRoute);

module.exports = emailsRouter;