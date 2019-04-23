var mongoose = require("mongoose")

var matchSchema = new mongoose.Schema({
    round : mongoose.Schema.Types.Mixed,
    date : Date,
    homeTeam : String,
    awayTeam : String,
    players : Array,
    unavailable : Array,
    canPlay : Array,
    score: String,
    updated: Boolean,
    comments: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
        ]
});
// var Match = mongoose.model("Match", matchSchema);

module.exports = mongoose.model("Match", matchSchema);