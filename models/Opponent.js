var mongoose = require("mongoose");

var oppositionSchema = new mongoose.Schema({
    team: String,
    position: Number,
    points: Number,
    percentage: Number,
    updated: Boolean,
    submitted: Boolean,
    dateUpdated: {type:Date, default: Date.now}
});

// var Opponent = mongoose.model("Opponent", oppositionSchema);


module.exports = mongoose.model("Opponent", oppositionSchema);