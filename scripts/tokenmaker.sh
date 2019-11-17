#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const nanoid = require('nanoid');
const JwtService = require('../services/jwt');

const [messageId] = process.argv.slice(2);

const ENCRYPTION_PUBLIC_KEY = fs.readFileSync(path.resolve(__dirname, './enc.pem'));

const jwtService = new JwtService({ publicKey: ENCRYPTION_PUBLIC_KEY, expiresIn: 3600 });

const payload = { messageId: messageId || '8E2RIOTGW_55klI', cnonce: nanoid() };

(async () => {
  const signedPayload = await jwtService.sign(payload);
  const token = await jwtService.encrypt(signedPayload);
  console.info(`\n1. messageId: \n\n${payload.messageId}\n`);
  console.info(`2. JWT token: \n\n${token}\n`);
})();