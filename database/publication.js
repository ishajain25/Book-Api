const mongoose = require("mongoose");

//Creating an publication schema
const PublicationSchema = mongoose.Schema({
    id: Number ,
    name: String,
    books: [String],
});

//Create a publication model
const PublicationModel = mongoose.model( PublicationSchema);

module.exports = PublicationModel;