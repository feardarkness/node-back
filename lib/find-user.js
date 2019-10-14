const users = require('../fixtures/users');
const { compare } = require('./encrypt-decrypt');

const findUserByCredentials = async ({ username, password }) => {
  let user = undefined;
  for(let i = 0; i < users.length; i++) {
    const equals = await compare(password, users[i].password);
    if (users[i].username === username && equals) {
      user = users[i];
    }
  }
  return user;
};

exports.byCredentials = findUserByCredentials;