const crypto = require('crypto');
const jwt = require('jsonwebtoken');

class JwtToken {
  constructor ({
    privateKey,
    publicKey,
    expiresIn = '60s',
    passphrase = 'diogenes'
  }) {
    this.privateKey = privateKey;
    this.publicKey = publicKey;
    this.expiresIn = expiresIn;
    this.passphrase = passphrase;
  }

  sign (message) {
    try {
      return jwt.sign(
        message,
        this.passphrase,
        { expiresIn: this.expiresIn }
      );
    } catch (err) {
      throw new Error('Failed to sign token');
    }
  }

  verify (jwtToken) {
    try {
      return jwt.verify(jwtToken, this.passphrase);
    } catch (err) {
      throw new Error('Failed to verify token.');
    }
  }

  encrypt (signedToken) {
    try {
      return crypto.publicEncrypt(
        this.publicKey,
        Buffer.from(signedToken, 'binary')
      ).toString('base64');
    } catch (err) {
      throw new Error('Failed to encrypt token.');
    }
  }

  decrypt (encryptedToken) {
    try {
      return crypto.privateDecrypt(
        this.privateKey,
        Buffer.from(encryptedToken, 'base64')
      ).toString('utf8');
    } catch (err) {
      throw new Error('Failed to decrypt token.');
    }
  }
}

module.exports = JwtToken;
