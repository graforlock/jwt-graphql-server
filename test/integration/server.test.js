/* eslint-env jest */
const fs = require('fs');
const path = require('path');
const nanoid = require('nanoid');
const rp = require('request-promise');

const appStartup = require('../../server');

const JwtService = require('../../services/jwt');

const ENCRYPTION_PUBLIC_KEY = fs.readFileSync(path.resolve(__dirname, '../../scripts/enc.key'));
const { MONGO_DB_NAME, PORT } = process.env;
const API_URL = `http://localhost:${PORT}`;

const message = { messageId: '4FjDaWFDZpVHDHFwdHR_t' };
const payload = { messageId: '4FjDaWFDZpVHDHFwdHR_t', cnonce: nanoid() };

const jwtService = new JwtService({
  publicKey: ENCRYPTION_PUBLIC_KEY
});

describe('API integration tests', () => {
  let server;
  let mongo;
  let messages;
  let token;
  let tokens;

  beforeAll(async () => {
    const app = await appStartup();
    mongo = app.mongoClient;
    server = app.server;
    messages = mongo.db(MONGO_DB_NAME).collection('messages');
    tokens = mongo.db(MONGO_DB_NAME).collection('tokens');
    await messages.insertOne(message);
  });

  afterAll(async () => {
    await messages.drop();
    await tokens.drop();
    await mongo.close();
    await server.close();
  });

  beforeEach(async () => {
    const signedPayload = await jwtService.sign(payload);
    token = await jwtService.encrypt(signedPayload);
  });

  it('query getMessages authenticates and returns a message', async () => {
    const headers = { authorization: token };
    const query = `
      query {
        getMessages(messageId: "${message.messageId}") {
          messageId
        }
      }
    `;

    const response = await rp({
      method: 'POST',
      uri: API_URL,
      headers,
      body: { query },
      json: true
    });

    expect(response).toMatchSnapshot();
  });

  it('query getMessages fails on duplicate cnonce insertion', async () => {
    let response;
    const headers = { authorization: token };
    const query = `
      query {
        getMessages(messageId: "${message.messageId}") {
          messageId
        }
      }
    `;

    for (_ of [1, 2]) {
      response = await rp({
        method: 'POST',
        uri: API_URL,
        headers,
        body: { query },
        json: true
      });
    }

    expect(response.errors[0].message).toEqual(
      expect.stringContaining('E11000 duplicate key error collection')
    );
  });
});
