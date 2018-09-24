const mongoose = require('mongoose');
mongoose.connect(`mongodb://localhost:${process.env.PORT}/GraphQL`,{useNewUrlParser: true});