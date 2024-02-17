var { graphql, buildSchema } = require('graphql');

const AGE = 29;
// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String,
    age: Int
  }
`);

// resolver function for each API endpoint
var rootValue = {
  hello: () => {
    return 'Hello world!';
  },
  age: () => {
    return AGE;
  },
};

graphql({
  schema,
  source: '{ hello, age }',
  rootValue,
}).then((response) => {
  console.log(response);
});
