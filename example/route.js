/**
File can be disregarded
**/



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
