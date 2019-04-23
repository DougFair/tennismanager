var express = require("express");
var router = express.Router();
var Note = require("../models/Note.js");
var middleware = require("../middleware");


router.get("/notes", middleware.isLoggedIn, function(req,res){
    res.render("addNotes");
});

router.post("/notes", middleware.isLoggedIn, function(req,res){
    Note.create(req.body.note, function (err, note){
        if(err){
            console.log("Error");
        } else {
            res.redirect("/season_prac"); 
        }
    });
});

router.delete("/notes/:id", middleware.isLoggedIn, function(req,res){
    Note.findByIdAndRemove(req.params.id, function (err, note){
        if(err){
            console.log("Error");
        } else {
            res.redirect("/season_prac"); 
        }
    });
});


 module.exports = router;