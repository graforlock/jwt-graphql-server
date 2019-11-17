const fs = require('fs');
const path = require('path');
const { ApolloServer, makeExecutableSchema } = require('apollo-server');
const { MongoClient } = require('mongodb');

const JwtService = require('./services/jwt');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const Messages = require('./repositories/messages');
const Tokens = require('./repositories/tokens');

const {
  MONGO_URI,
  MONGO_DB_NAME,
  PORT,
  ENCRYPTION_PRIVATE_KEY_PATH
} = process.env;

const ENCRYPTION_PRIVATE_KEY = fs.readFileSync(path.resolve(__dirname, ENCRYPTION_PRIVATE_KEY_PATH));

const jwtService = new JwtService({ privateKey: ENCRYPTION_PRIVATE_KEY });

const startUp = async () => {
  try {
    const mongoClient = await MongoClient.connect(`mongodb://${MONGO_URI}`,
      { useUnifiedTopology: true });
    const db = mongoClient.db(MONGO_DB_NAME);
    const schema = makeExecutableSchema({ typeDefs, resolvers });
    const apolloServer = new ApolloServer({
      schema,
      dataSources: () => {
        return {
          messages: new Messages(db),
          tokens: new Tokens(db)
        };
      },
      context: async ({ req }) => {
        const token = req.headers.authorization;
        const decryptedToken = await jwtService.decrypt(token);
        const payload = await jwtService.verify(decryptedToken);
        return { payload };
      }
    });

    const { url, server } = await apolloServer.listen(PORT);
    console.info(`listening at ${url}`);

    return { mongoClient, server };
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = startUp;
