var express = require("express");
var router = express.Router();
var Photo = require("../models/Photo.js");
var PDFfile = require("../models/PDFfile.js");
var fs = require("fs");
var middleware = require("../middleware");
var upload = require('../imageUpload');

var aws = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3');
var bodyParser = require('body-parser');




// ============PHOTO FILE ROUTES ============
router.get("/photoCreate", middleware.isLoggedIn, function(req,res){
    Photo.find({}, function(err,photos){
        if (err){
            console.log("Error");
        } else {
            res.render("photoCreate", {photos:photos});   
        }
    });
});

router.post("/photoCreate", upload.single("file"), middleware.isLoggedIn, function(req,res){
        var photo = req.file;
        if (!photo){
        req.flash("error", "You didnt upload a file");
        res.redirect("/photoCreate");
        } else {
        var caption = req.body.caption;
        var imagePath = req.file.location;
        Photo.create({imagePath:imagePath, caption:caption}, function(err,photos){
            if(err){
                console.log("Error");
            } else {
                req.flash("success", "Photo successfully uploaded");
                res.redirect("/photoCreate");
            }
        });
    }
});    

// router.post('/photoCreate', upload.single("file"), middleware.isLoggedIn, function(req, res) {
//     console.log("Upload:", req.file);
//         console.log("Upload2:", req.file.location);
//     req.flash("success", "Photo successfully uploaded");
//     res.redirect("/photoCreate")
    
// });  

router.delete("/photoDelete/:id", middleware.isLoggedIn, function(req, res){
    Photo.findByIdAndRemove(req.params.id, function(err){
        if (err) {
            console.log("Error");
        } else {
            res.redirect("/photoCreate");
        }
    });
});

// ============PDF FILE ROUTES============

// Uploading file routes
router.get("/pdfUpload", middleware.isLoggedIn, function(req,res){
    res.render("pdfUpload");
});

//  Path for uploading to disk instead of Amazon S3

// router.post("/pdfCreate", middleware.isLoggedIn, function(req,res){
//     console.log(req.file.path)
//     console.log("Filename:" + req.file.mimetype);
//     var pdfFile = req.file;
//     var fileName = req.body.fileName;
//     var pdfPath= pdfFile.path;
//     if (!pdfFile){
//         req.flash("error", "You didnt upload a file");
//         res.redirect("/pdfUpload");
//     } else {
//         PDFfile.create({pdfPath:pdfPath, fileName:fileName}, function(err,files){
//             if(err){
//                 console.log("Error");
//             } else {
//                 console.log("Files: " + files);
//                 req.flash("success", "PDF successfully uploaded");
//                 res.redirect("/pdfUpload");
//             }
//         });
//     }
// });

router.post("/pdfCreate", upload.single("file"), middleware.isLoggedIn, function(req,res){
    var pdfFile = req.file;
    var fileName = req.body.fileName;
    var pdfPath= req.file.location;
    if (!pdfFile){
        req.flash("error", "You didnt upload a file");
        res.redirect("/pdfUpload");
    } 
     if (pdfFile.mimetype !== "application/pdf"){
        req.flash("error", "Thats is not a PDF file");
        res.redirect("/pdfUpload");
    }  else {
        PDFfile.create({pdfPath:pdfPath, fileName:fileName}, function(err,files){
            if(err){
                console.log("Error");
            } else {
                req.flash("success", "PDF successfully uploaded");
                res.redirect("/pdfUpload");
            }
        });
    }
});

//  Path for uploading PDF to disk instead of Amazon S3

// router.get("/getPDF/:id", middleware.isLoggedIn, function(req,res,next){
//     PDFfile.findById(req.params.id, function(err, pdf){
//         if (err) {
//             console.log("Error Error");
//         } else {
//     fs.readFile(pdf.pdfPath, function(err,data){
//         if (err){
//             return next (err);
//         } 
//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader("Content-Disposition", "attachment; filename=" + pdf.fileName + ".pdf");    
//     res.send(data);
//             });        
//         } 
//     }); 
// });

// Displaying and deleting file routes
router.get("/pdfFileList", middleware.isLoggedIn, function(req,res){
    PDFfile.find({}, function (err,files){
        if (err){
            console.log("Error");
        } else {
           res.render("pdfFileList", {files : files}); 
        }
    });
});



router.delete("/getPDF/:id", middleware.isLoggedIn, function(req,res,next){
    PDFfile.findByIdAndRemove(req.params.id, function(err){
        if (err) {
            console.log("Error");
        } else {
            req.flash("success", "File successfully removed");
            res.redirect("back");
        }
    });
});


router.get("/email", middleware.isLoggedIn, function(req,res){
    res.render("email");
});


module.exports = router;