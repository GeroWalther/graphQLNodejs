var express = require('express');
var { createHandler } = require('graphql-http/lib/use/express');
var {
  buildSchema,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
} = require('graphql');
var { ruruHTML } = require('ruru/server');

const AGE = 29;
const WEIGHT = 70;
const ISOVER18 = true;
const HOBBIES = ['F1', 'Golf', 'Motorcycless'];

// Construct a schema, using GraphQL schema language. This approach does not work for custom resolvers which are needed for the nested object types
// var schema = buildSchema(`
//   type Query {
//     hello(name: String!): String

//     age: Int!
//     weight: Float!
//     isOver18: Boolean
//     hobbies: [String!]!
//     user : User
//   }
//   type User {
//     id: ID
//     name: String
//     posts: [Post]
//     friends: [User]
//     invitedBy: User
//   }
//   type Post {
//     id: ID
//     content: String
//   }

// `);

// resolver function for each API endpoint. Combined with Schema above as GraphQLSchema class below to be able to use custom resolvers
// var rootValue = {
//   hello: ({ name }) => {
//     return 'Hello ' + name;
//   },
//   age: () => {
//     return AGE;
//   },
//   weight: () => {
//     return WEIGHT;
//   },
//   isOver18: () => {
//     return ISOVER18;
//   },
//   hobbies: () => {
//     return HOBBIES;
//   },
//   user: () => {
//     return {
//       id: 1,
//       name: 'Gero',
//     };
//   },
// }

const User = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: {
      type: GraphQLInt,
    },
    name: {
      type: GraphQLString,
      resolve: (obj) => {
        const name = obj.name.trim().toUpperCase();
        if (obj.isAdmin) {
          return `${name} (Admin)`;
        }
        return name;
      },
    },
  },
});

// alowws us to add resolvers even to custom object types
const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      hello: {
        type: GraphQLString,
        resolve: () => {
          return 'Hello World';
        },
      },
      user: {
        type: User,
        resolve: () => {
          return {
            id: 1,
            name: 'Gero',
            isAdmin: true,
          };
        },
      },
    },
  }),
});

var app = express();

// Create and use the GraphQL handler.
app.all(
  '/graphql',
  createHandler({
    schema,
  })
);

// Serve the GraphiQL IDE.
app.get('/', (_req, res) => {
  res.type('html');
  res.end(ruruHTML({ endpoint: '/graphql' }));
});

// Start the server at port
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');
