//imports
const { encode, decode } = require('./base64url.js');
const { cipher, decipher } = require('./cipher.js');
const { encryptCEK, decryptCEK } = require('./cipher.js');
const protectedHeader = require('./protectedHeader.js');

/**
 * @function - joins the values into a string with a dot seperator
 * @returns joined base64url encoded values 
 */
const joiner = (ciphertext, iv, tag, eCEK, encodedProtectedHeader) => {
   const constructed = [encodedProtectedHeader,encode(eCEK), encode(iv), encode(ciphertext), encode(tag)].join('.');
    return constructed;
}



/**
 * @description - encrypts a plaintext message
 * @param {string} data - The data to be encrypted
 * @param {string} publicKey - The public key
 * @returns {string} - JWE object
 */
const JWEBuilder =  async (data, publicKey) => {
    const encodedProtectedHeader = encode(protectedHeader());
    const { cek, iv, ciphertext, tag } = await cipher(data, encodedProtectedHeader);
    const eCEK =  await encryptCEK(cek, publicKey);
    const jwe = joiner(ciphertext, iv, tag, eCEK.cekEncrypt, encodedProtectedHeader);
    return jwe;
}

/**
 * @description - decrypts a JWE body
 * @param {string} jwe - JWE body
 * @param {string} privateKey - The private key
 * @param {string} secretPassphrase - The secret passphrase
 * @returns {string} - Plaintext
 */

const JWEDecryptor = async (jwe, privateKey, secretPassphrase) => {
    if (!jwe) throw new Error('JWE body is required');
    const [encodedProtectedHeader, cek, iv, ciphertext, tag] = jwe.split('.');
    const dCEK = await decryptCEK(decode(cek), privateKey, secretPassphrase);
    const plaintext = decipher(decode(ciphertext), decode(iv), decode(tag), dCEK.cekDecrypt, encodedProtectedHeader);
    return plaintext;
}


module.exports = {
    JWEBuilder,
    JWEDecryptor,
};