const crypto = require('crypto');

/**
 * @description - Generates random initialization vector for AES-256-GCM to add unique encryption values each time.
 * @returns {Buffer} - Randomly generated IV buffer
 */
const generateIV = () => {
  const length = 12; // AES-256-GCM nonce size
  const iv = crypto.randomBytes(length);
  return iv;
};

module.exports = generateIV;
