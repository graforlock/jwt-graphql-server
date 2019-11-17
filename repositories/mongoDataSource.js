const { DataSource } = require('apollo-datasource');

class MongoDataSource extends DataSource {
  constructor (dbConnection, collectionName, collectionId, options) {
    super();
    this.collectionName = collectionName;
    this.collectionId = collectionId;
    this.dataSource = dbConnection.collection(collectionName);
  }

  getDataSource () {
    return this.dataSource;
  }

  findById (id) {
    const query = {};
    query[this.collectionId] = { $eq: id };
    return this.dataSource.findOne(query);
  }
}

module.exports = MongoDataSource;
