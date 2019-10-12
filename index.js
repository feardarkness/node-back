const express = require('express');
const usersRouter = require('./routes/users');
const emailsRouter = require('./routes/emails');
const logger = require('./lib/logger');
const NotFound = require('./errors/not-found');
const compress = require('compression')
const serveStatic = require('serve-static');
const path = require('path');
const emails = require('./fixtures/emails');

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

let setHeaders = (res, path, stat) => {
  const lastIndex = path.lastIndexOf('/');
  const name = path.substring(lastIndex);
  let mime = 'none';
  emails.forEach(email => {
    if (email.attachments) {
      email.attachments.forEach(attachment => {
        if (attachment.filename === `/uploads${name}`) {
          mime = attachment.mimetype;
        }
      });
    }
  });
  res.setHeader('Content-Type', mime);
};

app.use(logger);
app.use(compress());
app.use(serveStatic(path.join(__dirname, './public')));
app.use('/uploads', serveStatic(path.join(__dirname, 'uploads'), {
  setHeaders,
}));

app.use('/users', usersRouter);
app.use('/emails', emailsRouter);

app.use(notFoundHandler);

app.listen(3000);
