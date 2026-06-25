const keyPair = require('./src/key.js');
const { JWEBuilder, JWEDecryptor } = require('./src/formatter.js');

module.exports = {
  keyPair,
  JWEBuilder,
  JWEDecryptor,
};
