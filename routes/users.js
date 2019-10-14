const express = require('express');
const users = require('../fixtures/users');
const { respondWithCsv, respondWithJson, respondWithXml } = require('../helpers/formatters');
const requireAuth = require('../lib/require-auth');

const responsesByType = {
  'text/csv': respondWithCsv,
  'application/xml': respondWithXml,
};

const getUsersRoute = (req, res) => {
  const type = req.accepts();
  const respond = responsesByType[type] || respondWithJson;
  respond(req, res, users);
};

let getUserRoute = (req, res) => {
  let user = users.find(user => user.id === req.params.id);
  res.send(user);
};

const usersRouter = express.Router();

usersRouter.use(requireAuth);
usersRouter.get('/', getUsersRoute);
usersRouter.get('/:id', getUserRoute);

module.exports = usersRouter;
