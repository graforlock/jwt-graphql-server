/* eslint-env jest */
const testUtils = require('../__utils__');
const { privateKey, publicKey } = require('../__utils__/keypair');

const JwtService = require('../../services/jwt');

describe('JwtService', () => {
  let secretJwt;
  let encryptedToken;
  let decryptedToken;
  let verifiredToken;
  let jwtService;

  const message = { message: 'some secret message' };

  beforeEach(() => {
    jwtService = new JwtService({ privateKey, publicKey, expiresIn: '1s' });
  });

  it('signs/creates a JWT token', () => {
    secretJwt = jwtService.sign(message);

    expect(typeof secretJwt).toBe('string');
    expect(secretJwt.length).toMatchSnapshot(171);
  });

  it('encrypts a valid JWT token', () => {
    encryptedToken = jwtService.encrypt(secretJwt);

    expect(testUtils.typeOf(encryptedToken)).toBe('String');
  });

  it('decrypts an encoded JWT token', () => {
    decryptedToken = jwtService.decrypt(encryptedToken);

    expect(decryptedToken).toEqual(secretJwt);
  });

  it('validates a decrypted JWT token', () => {
    verifiredToken = jwtService.verify(decryptedToken);

    expect(verifiredToken.message).toBe(message.message);
  });

  it('times out a token after 2000 seconds', async () => {
    try {
      await testUtils.delay(2000);
      verifiredToken = jwtService.verify(decryptedToken);
    } catch (err) {
      expect(err.message).toBe('Failed to verify token.');
    }
  });
});
