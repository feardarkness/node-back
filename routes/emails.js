const express = require('express');
const emails = require('../fixtures/emails');
const { respondWithCsv, respondWithJson, respondWithXml } = require('../helpers/formatters');
const generateId = require('../lib/generate-id')
const bodyParser = require('body-parser');
const NotFound = require('../errors/not-found');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const requireAuth = require('../lib/require-auth');
const enforce = require('../lib/enforce');

let upload = multer({
  dest: path.join(__dirname, '../uploads'),
});

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
  let attachments = (req.files || []).map(file => ({
    filename: `/uploads/${file.filename}`,
    mimetype: file.mimetype,
  }));

  let newEmail = {
    ...req.body,
    id: generateId(),
    attachments,
  };
  emails.push(newEmail);
  
  res.status(201);
  res.send(newEmail);  
};

let updateEmailRoute = (req, res) => {
  let attachments = (req.files || []).map(file => ({
    filename: `/uploads/${file.filename}`,
    mimetype: file.mimetype,
  }));

  (email.attachments || []).forEach(attachment => {
    fs.unlinkSync(path.join(__dirname, '..', attachment));
  });
  Object.assign(email, {
    ...req.body,
    attachments,
  });
  res.send(email);
};

let deleteEmailRoute = async (req, res) => {
  const index = emails.findIndex(email => email.id === req.params.id);
  emails.splice(index, 1);
  res.sendStatus(204);
};

let updateEmailPolicy = (req) => {
  let email = emails.find(email => email.id === req.params.id);
  let user = req.user;
  return user.id === email.from;
};

let deleteEmailPolicy = (req) => {
  let email = emails.find(email => email.id === req.params.id);
  let user = req.user;
  return user.id === email.from;
};

const emailsRouter = express.Router();

emailsRouter.use(requireAuth);

emailsRouter.get('/', getEmailsRoute);
emailsRouter.post('/', bodyParser.json(), bodyParser.urlencoded({ extended: true }), upload.array('attachments'), createMailRoute);

emailsRouter.get('/:id', getEmailRoute);
emailsRouter.patch('/:id',  enforce(updateEmailPolicy), bodyParser.json(), upload.array('attachments'), updateEmailRoute);
emailsRouter.delete('/:id', enforce(deleteEmailPolicy), deleteEmailRoute);

module.exports = emailsRouter;