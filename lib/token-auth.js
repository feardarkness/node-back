const jwt = require('jsonwebtoken');

const signature = process.env.SIGNATURE;


let tokenAuth = (findUserByToken) => {
  return (req, res, next) => {
    let header = req.headers.authorization || '';
    let [type, token] = header.split(' ');

    if (type === 'Bearer') {
      let payload;
      try {
        payload = jwt.verify(token, signature);
      } catch (err) {
        return res.sendStatus(401);
      }

      let user = findUserByToken(payload);
      if (user) {
        req.user = user;
      } else {
        return res.sendStatus(401);
      }
    }
    next();
  }
};

module.exports = tokenAuth;