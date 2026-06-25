const { generateKeyPair } = require('crypto');

/**
 * @typedef {Object} KeyPairOptions
 * @property {number} modulusLength - RSA key length in bits
 * @property {'spki'} publicKeyType - Public key encoding type
 * @property {'pkcs8'} privateKeyType - Private key encoding type
 * @property {string} [secretPassphrase] - Optional passphrase for private key PEM encryption
 */
class keyPair {
  /**
   * @param {KeyPairOptions} options
   */
  constructor(options) {
    if (!options || typeof options !== 'object') throw new Error();
    this.modulusLength = Number(options.modulusLength || 2048);
    if (this.modulusLength < 2048) throw new Error('Modulus length must be at least 2048 bits');
    this.publicKeyType = 'spki';
    this.privateKeyType = String(options.privateKeyType || 'pkcs8');
    this.secretPassphrase = options.secretPassphrase ? String(options.secretPassphrase) : undefined;
  }

  /**
   * @description - Generates RSA key pair using crypto module's generateKeyPair function
   * @returns {Promise<{publicKey: string, privateKey: string}>}
   */
  generateKeys() {
    return new Promise((resolve, reject) => {
      const privateKeyEncoding = {
        type: this.privateKeyType,
        format: 'pem',
      };

      if (this.secretPassphrase) {
        privateKeyEncoding.cipher = 'aes-256-cbc';
        privateKeyEncoding.passphrase = this.secretPassphrase;
      }

      const publicKeyEncoding = {
        type: this.publicKeyType,
        format: 'pem',
      };

      generateKeyPair(
        'rsa',
        {
          modulusLength: this.modulusLength,
          publicKeyEncoding,
          publicExponent: 0x10001,
          privateKeyEncoding,
        },
        (err, publicKey, privateKey) => {
          if (err) return reject(err);
          resolve({ publicKey, privateKey });
        }
      );
    });
  }
}

module.exports = keyPair;
