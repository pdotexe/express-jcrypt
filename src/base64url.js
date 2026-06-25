// concise function call for base64url encoding and decoding


/** 
* @description - Converts buffer to URL safe string
* @param {Buffer | string} buffer - The input buffer to be encoded.
* @returns {string | null} - Encoded buffer string if buffer exists.
*/
const encode = (buffer) => {
    if (!buffer) return null;

    return Buffer.from(buffer).toString('base64url');

};

/** 
* @param {Buffer | string} encoded - Input string to decode
* @returns {Buffer | null} - Decoded buffer if input exists.
*/
const decode = (encoded) => {
    if (!encoded) return null;

    return Buffer.from(encoded, 'base64url');
};



module.exports = { encode, decode };