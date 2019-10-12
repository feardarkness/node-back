const express = require('express');

const usersRouter = require('./routes/users');
const emailsRouter = require('./routes/emails');
const logger = require('./lib/logger');
const NotFound = require('./errors/not-found');

let app = express();

let noRouteFound = (req, res) => {
  let route = req.method + ' ' + req.url;
  res.end(`You asked for ${route}`);
};

let notFoundHandler = (err, req, res, next) => {
  if (err instanceof NotFound) {
    res.send({ error: err.message });
  } else {
    next(err);
  }
};

app.use(logger);

app.use('/users', usersRouter);
app.use('/emails', emailsRouter);

app.use(notFoundHandler);

app.listen(3000);
