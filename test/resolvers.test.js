/* eslint-env jest */
const resolvers = require('../graphql/resolvers');
const nanoid = require('nanoid');

describe('resolvers', () => {
  let args;
  let context;
  let messageId;

  const throwError = () => { throw new Error(); };

  beforeEach(async () => {
    messageId = nanoid();
    args = { messageId };
    context = {
      payload: { messageId },
      dataSources: {
        tokens: { insertOne: jest.fn() },
        messages: { findById: jest.fn() }
      }
    };
  });

  describe('Query', () => {
    describe('getMessages', () => {
      it('throws ForbiddenError if payload messageId doesn\'t match the argument', async () => {
        args.messageId = nanoid();
        try {
          await resolvers.Query.getMessages(null, args, context);
        } catch (err) {
          expect(err.message).toEqual('JWT payload corrupted (mismatch).');
        }
      });

      it('throws ForbiddenError if payload is missing', async () => {
        context.payload = undefined;
        try {
          await resolvers.Query.getMessages(null, args, context);
        } catch (err) {
          expect(err.message).toEqual('JWT missing payload.');
        }
      });

      describe('tokens.insertOne', () => {
        it('successfully calls tokens.insertOne', async () => {
          await resolvers.Query.getMessages(null, args, context);

          expect(context.dataSources.tokens.insertOne).toHaveBeenCalled();
        });

        it('throws ForbiddenError if cnonce duplicate error is thrown', async () => {
          context.dataSources.tokens.insertOne.mockImplementationOnce(throwError);
          try {
            await resolvers.Query.getMessages(null, args, context);
          } catch (err) {
            expect(err.message).toEqual('JWT authentication error.');
          }
        });
      });

      describe('messages.findById', () => {
        it('successfully calls findById to retrieve a message', async () => {
          context.dataSources.messages.findById.mockReturnValue({ messageId });

          const message = await resolvers.Query.getMessages(null, args, context);

          expect(context.dataSources.messages.findById).toHaveBeenCalled();
          expect(message).toEqual({ messageId: expect.any(String) });
        });
      });
    });
  });
});
