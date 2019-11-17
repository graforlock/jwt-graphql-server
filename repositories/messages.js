const MongoDataSource = require('./mongoDataSource');

const COLLECTION_NAME = 'messages';
const COLLECTION_ID = 'messageId';

class Messages extends MongoDataSource {
  constructor (dbConnection, options) {
    super(dbConnection, COLLECTION_NAME, COLLECTION_ID, options);
  }
}

module.exports = Messages;
