const { ForbiddenError } = require('apollo-server');

const resolvers = {
  Query: {
    getMessages: async (_, args, ctx) => {
      if (!ctx.payload) throw new ForbiddenError('JWT missing payload.')
      if (args.messageId !== ctx.payload.messageId) {
        throw new ForbiddenError('JWT payload corrupted (mismatch).');
      }

      try {
        await ctx.dataSources.tokens.insertOne(ctx.payload.cnonce);
      } catch (err) {
        throw new ForbiddenError('JWT authentication error.');
      }

      return ctx.dataSources.messages.findById(args.messageId);
    }
  }
};

module.exports = resolvers;
