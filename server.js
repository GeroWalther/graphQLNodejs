var express = require('express');
var { createHandler } = require('graphql-http/lib/use/express');
var { buildSchema } = require('graphql');
var { ruruHTML } = require('ruru/server');

const AGE = 29;
const WEIGHT = 70;
const ISOVER18 = true;
const HOBBIES = ['F1', 'Golf', 'Motorcycless'];

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello(name: String!): String

    age: Int!
    weight: Float! 
    isOver18: Boolean
    hobbies: [String!]!
  }
`);

// resolver function for each API endpoint
var rootValue = {
  hello: ({ name }) => {
    return 'Hello ' + name;
  },
  age: () => {
    return AGE;
  },
  weight: () => {
    return WEIGHT;
  },
  isOver18: () => {
    return ISOVER18;
  },
  hobbies: () => {
    return HOBBIES;
  },
};

var app = express();

// Create and use the GraphQL handler.
app.all(
  '/graphql',
  createHandler({
    schema,
    rootValue,
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
