const express = require('express');
const graphqlHTTP = require('express-graphql');
require('./mongoose/connect.js');
const { schema } = require('./graphql-schemas/schema.js');

const app = express();
const port = process.env.PORT || 3000;

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true,
    pretty: true
}))

app.listen(port, () => console.log(`Listening to port ${port}`));