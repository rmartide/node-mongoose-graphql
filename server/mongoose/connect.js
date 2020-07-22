const mongoose = require("mongoose");
var db = "GraphQL";
if (process.env.NODE_ENV === "test") {
	db = "GraphQLTesting";
}
console.log(db);
mongoose.connect(`mongodb://localhost:${process.env.PORT}/${db}`, { useNewUrlParser: true, useUnifiedTopology: true });
