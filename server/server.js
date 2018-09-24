const express = require('express');
const graphqlHTTP = require('express-graphql');
require('./mongoose/connect.js');
const { schema } = require('./graphql-schemas/schema');

const app = express();
const port = process.env.PORT || 3000;

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true,
    pretty: true,
    formatError: (err) => {
        if (err.originalError && err.originalError.name === 'ValidationError')
            return ({ mesage: err.message, statusCode: 400 });
        return err;
    }
}));

app.listen(port, () => console.log(`Listening to port ${port}`));

module.exports = app;