const generateIV = require('./iv.js');
const { encode } = require('./base64url.js');
const crypto = require('crypto');
const protectedHeader = require('./protectedHeader.js');
/**
 * @description - literal encryption function that takes plaintext and public key, generates random IV, CEK, and encrypts using AES-256-GCM.
 * @param {string} plaintext - The data to be encrypted
 */

// generates a symmetric encryption key
const generateCEK = () => crypto.randomBytes(32);

/**
 * 
 * @description - encrypt the generated CEK
 * @returns - Encrypted CEK
 */
const encryptCEK = async (contentEncKey, publicKey) => {
    const options = {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
    }
    const cekEncrypt = crypto.publicEncrypt(options, contentEncKey);    
    return { cekEncrypt };
};  

/**
 * 
 * @description - decrypt the encrypted CEK
 * @returns- Decrypted CEK
 */
const decryptCEK = async (encryptedCEK, privateKey, secretPassphrase) => {
    const options = {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        passphrase: secretPassphrase ? secretPassphrase : undefined,
        oaepHash: 'sha256',
    }
    const cekDecrypt = crypto.privateDecrypt(options, encryptedCEK);
    return { cekDecrypt };
} 


/**
 * 
 * @description - payload encryption function 
 * @returns {string} cek, iv, ciphertext, tag, encodedProtectedHeader
 */

const cipher = async (plaintext, encodedProtectedHeader) => {
  const cek = generateCEK();
  
  const iv = generateIV(); // initialization vector
  const enc = crypto.createCipheriv('aes-256-gcm', cek, iv); // actual encryption of the content enc key
  enc.setAAD(Buffer.from(encodedProtectedHeader, 'ascii'));
  const ciphertext = Buffer.concat([enc.update(plaintext, 'utf8'), enc.final()]); // convert to utf8 and concatenate 
  const tag = enc.getAuthTag();
    

  return { cek, iv, ciphertext, tag, encodedProtectedHeader};

  
}
/**
 * @description - decryption function   
 * @returns {string} - UTF-8 encoded decrypted payload.
 * 
 */

const decipher = (ciphertext, iv, tag, cek , encodedProtectedHeader) => {
    if (!ciphertext || !iv || !tag || !cek) throw new Error('Missing ciphertext, iv, tag, or cek');
    const undecipher = crypto.createDecipheriv('aes-256-gcm', cek, iv);
    undecipher.setAAD(Buffer.from(encodedProtectedHeader, 'ascii'));
    undecipher.setAuthTag(tag);
    const decrypted = Buffer.concat([undecipher.update(ciphertext), undecipher.final()]);
    return decrypted.toString('utf8');

}
module.exports = { cipher, encryptCEK, decryptCEK, decipher };
