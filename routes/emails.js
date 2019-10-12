const express = require('express');
const emails = require('../fixtures/emails');
const { respondWithCsv, respondWithJson, respondWithXml } = require('../helpers/formatters');
const generateId = require('../lib/generate-id')
const jsonBodyParser = require('../lib/json-body-parser');
const NotFound = require('../errors/not-found');

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
  if (!email) {
    throw new NotFound('Email not found');
  }
  res.send(email);
};

let createMailRoute = async (req, res) => {
  let newEmail = {
    ...req.body,
    id: generateId(),
  };
  emails.push(newEmail);
  
  res.status(201);
  res.send(jsonBody);  
};

let updateEmailRoute = (req, res) => {
  let email = emails.find(email => email.id === req.params.id);
  Object.assign(email, req.body);
  res.send(email);
};

let deleteEmailRoute = async (req, res) => {
  const index = emails.findIndex(email => email.id === req.params.id);
  emails.splice(index, 1);
  res.sendStatus(204);
};

const emailsRouter = express.Router();

emailsRouter.get('/', getEmailsRoute);
emailsRouter.post('/', jsonBodyParser, createMailRoute);

emailsRouter.get('/:id', getEmailRoute);
emailsRouter.patch('/:id', jsonBodyParser, updateEmailRoute);
emailsRouter.delete('/:id', deleteEmailRoute);

module.exports = emailsRouter;