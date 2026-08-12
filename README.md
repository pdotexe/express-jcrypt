

![Node.js Logo](https://vectorlogo.zone)





express-jcrypt is a Node/Express module to quickly add JSON Web Encryption (JWE) to microservice/internal APIs. 


## ⚙️ JWE Components
* Protected Header-metadata and source of truth
* Content encryption key (CEK) - symmetric data encryption
* Initialization Vector (IV) - random 12-byte noise to cipher
* Ciphertext - Data body
* Authtag - tamper validation


## Features    
🔑 Promise based key generation
🔒 AES-256-GCM standards to prevent data tampering
⚡️ Simple and fast
💡 Node crypto API abstraction

## Core Functions
```javascript
// generate keys (pem display format)
keyPair(2048, spki, pkcs8, secretPassphrase); // params: modulus length (default 2048), publicKeyType (default spki), privateKeyType (default pkcs8), secretPassphrase(optional, uses aes-256-cbc cipher)


JWEBuilder(data, publicKey); //params: data (JSON), publicKey

JWEDecryptor(jwe, privateKey, secretPassphrase) // params: jwe (payload), privateKey, secretPassphrase ( if used )

```
## Installation

Install the package directly:


```
npm install express-jcrypt
```

## Usage

### Notes:

⚠️ This library is not built for fetch or axios API
⚠️ Never write keys to disk

**Example**

```javascript
const express = require('express');
const { keyPair, JWEBuilder, JWEDecryptor } = require('express-jcrypt');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.0.0.1';
const app = express();

app.use(express.json());



// key generation 
(async () => {
  const kp = new keyPair({
    modulusLength: 2048,
    publicKeyType: 'spki',
    privateKeyType: 'pkcs8',
  }); // optional secretPassphrase argument



 
  const { publicKey, privateKey } = await kp.generateKeys();

// Basic endpoints
  app.post('/encrypt', async (req, res) => {

    const { data } = req.body;
    if (!data) return res.status(400).json({ error: 'Data is required' });
    const jwe = await JWEBuilder(data, publicKey);
    res.json({ jwe });

  });



  app.post('/decrypt', async (req, res) => {

    const { jwe } = req.body;
    if (!jwe) return res.status(400).json({ error: 'JWE is required' });
    const plaintext = await JWEDecryptor(jwe, privateKey); // include secretPassphrase if declared with object.
    res.json({ plaintext });

  });



  // start server
  app.listen(PORT, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
  });
})();
```
