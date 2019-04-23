var mongoose = require("mongoose")

var archiveSchema = new mongoose.Schema({
    season: String,
    year: Number,
    section: Number,
    teamMembers: Array,
    teams: Array,
    ladder:Array,
    details: Array,
});


module.exports = mongoose.model("Archive", archiveSchema);