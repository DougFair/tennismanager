var mongoose = require("mongoose")

var photoSchema = new mongoose.Schema({
    imagePath: String,
    caption: String,
});

module.exports = mongoose.model("Photo", photoSchema);