const { gql } = require('apollo-server');

const typeDefs = gql`
  type Message {
    messageId: String
  }

  type Query {
    getMessages(messageId: String): Message
  }
`;

module.exports = typeDefs;
