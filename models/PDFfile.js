var mongoose = require("mongoose");

var pdfFileSchema = new mongoose.Schema({
    pdfPath: String,
    fileName: String,
});

module.exports = mongoose.model("PDFfile", pdfFileSchema);