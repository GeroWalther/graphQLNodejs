import { ObjectId } from 'mongodb';

export const typeDef = /* GraphQL */ `
  type Query {
    users: [User!]!
    user(id: ID!): User
  }

  type Mutation {
    createUser(user: NewUserInput!): User
    deleteUser(id: ID!): Boolean
    updateUser(id: ID!, update: UpdateUserInput): User
  }

  input NewUserInput {
    name: String!
    email: String!
  }
  input UpdateUserInput {
    name: String!
  }

  type User {
    id: ID!
    name: String
    email: String

    comments: [Comment]
  }
`;

export const resolvers = {
  Query: {
    users: (obj, args, { mongo }) => {
      return mongo.mFlixusers.find().limit(20).toArray();
    },
    user: (obj, { id }, { mongo }) => {
      return mongo.mFlixusers.findOne({ _id: new ObjectId(id) });
    },
  },

  Mutation: {
    // obj, args, ctx
    createUser: async (_, { user }, { mongo }) => {
      const res = await mongo.mFlixusers.insertOne(user);
      return {
        id: res.insertedId,
        ...user,
      };
    },
    deleteUser: async (_, { id }, { mongo }) => {
      await mongo.mFlixusers.deleteOne({ _id: new ObjectId(id) });
      return true;
    },
    updateUser: async (obj, { id, update }, { mongo }) => {
      const res = await mongo.mFlixusers.updateOne(
        { _id: new ObjectId(id) },
        { $set: { name: update.name } }
      );
      return mongo.mFlixusers.findOne({ _id: new ObjectId(id) });
    },
  },

  User: {
    id: (obj) => {
      return obj._id || obj.id;
    },
    name: (obj) => {
      return obj.name.toUpperCase();
    },
    comments: ({ email }, a, { mongo }) => {
      return mongo.comments.find({ email }).limit(20).toArray();
    },
  },
};
