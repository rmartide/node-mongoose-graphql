const mongoose = require('mongoose');
mongoose.connect(`mongodb://localhost:${process.env.PORT}/GraphQL`,{useNewUrlParser: true});

const UserSchema = new mongoose.Schema({
    name: String
});

const User = mongoose.model('User', UserSchema);

const Pepito = new User({name: "Pepito"});
Pepito.save().then((result) => {
    console.log("SAVED", result);
}).catch((err) => {
    console.log("FAILED", err);
});