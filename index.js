const express = require('express');

const usersRouter = require('./routes/users');
const emailsRouter = require('./routes/emails');

let app = express();

let noRouteFound = (req, res) => {
  let route = req.method + ' ' + req.url;
  res.end(`You asked for ${route}`);
};

app.use('/users', usersRouter);
app.use('/emails', emailsRouter);

app.listen(3000);
