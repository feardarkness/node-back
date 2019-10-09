const express = require('express');

const users = require('./fixtures/users');
const emails = require('./fixtures/emails');
const { stringify } = require('csv');
const builder = require('xmlbuilder');


let app = express();



app.use((req, res) => {
  let route = req.method + ' ' + req.url;
  const type = req.accepts();

  
  
  if (route === 'GET /users') {
    if (type[0] === 'text/csv') {
      res.type('text/csv')
      stringify(users)
        .pipe(res);
    } else if (type[0] === 'application/xml') {
      res.type('application/xml')
      const xmlUsers = builder.create(users).end({ pretty: true });
      res.send(xmlUsers);
    } else {
      res.send(users);
    }
  } else if (route === 'GET /emails') {
    if (type[0] === 'text/csv') {
      res.type('text/csv')
      stringify(emails)
        .pipe(res);
    } else if (type[0] === 'application/xml') {
      res.type('application/xml')
      const xmlEmails = builder.create(emails).end({ pretty: true });
      res.send(xmlEmails);
    } else {
      res.send(emails);
    }
  } else {
    res.end(`You asked for ${route}`);
  }
});

app.listen(3000);