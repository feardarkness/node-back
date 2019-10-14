const bcrypt = require('bcrypt');

const saltRounds = 10;
const encrypt = word => bcrypt.hash(word, saltRounds);

const compare = (word, encryptedWord) => bcrypt.compare(word, encryptedWord);

exports.encrypt = encrypt;
exports.compare = compare;
