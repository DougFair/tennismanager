var mongoose = require("mongoose")

var commentsSchema = new mongoose.Schema({
    author : {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        username: String
    },
    text: String,
    date: Date
    
});


module.exports = mongoose.model("Comment", commentsSchema);