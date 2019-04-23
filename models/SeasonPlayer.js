var mongoose = require("mongoose")

var seasonPlayerSchema = new mongoose.Schema({
    year: Number,
    season: String,
    section: Number,
    teamMembers: Array,
    edited: {type: Boolean, default: false}
});


module.exports = mongoose.model("SeasonPlayer", seasonPlayerSchema);