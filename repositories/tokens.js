const MongoDataSource = require('./mongoDataSource');

const COLLECTION_NAME = 'tokens';
const COLLECTION_ID = '_id';
const TOKEN_EXPIRY = parseInt(process.env.TOKEN_EXPIRY);

class Tokens extends MongoDataSource {
  constructor (dbConnection, options) {
    super(dbConnection, COLLECTION_NAME, COLLECTION_ID, options);
    this.dataSource.createIndexes([
      { key: { cnonce: 1 }, unique: true },
      { key: { createdAt: 1 }, expireAfterSeconds: TOKEN_EXPIRY }
    ]);
  }

  insertOne (cnonce) {
    return this.dataSource.insertOne({ cnonce, createdAt: new Date() });
  }
}

module.exports = Tokens;
