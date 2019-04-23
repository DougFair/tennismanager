var mongoose = require("mongoose");

var noteSchema = new mongoose.Schema({
    author: String,
    text: String,
    dateUpdated: {type:Date, default: Date.now}
});

// var Opponent = mongoose.model("Opponent", oppositionSchema);


module.exports = mongoose.model("Note", noteSchema);