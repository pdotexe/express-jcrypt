
/**
 * @description - metadata containing algorithm and encryption method for JWE header. 
 * @returns {Buffer} - Buffer with JSON stringified protected JWE header.
 */

const protectedHeader = (alg = "RSA-OAEP-256", enc = "AES-256-GCM") => {
    const header = {alg, enc};

    
    const stringifyHeader = JSON.stringify(header);
    return Buffer.from(stringifyHeader);
}


module.exports = protectedHeader;