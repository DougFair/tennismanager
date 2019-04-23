var express = require("express");

var router = express.Router({mergeParams:true})
var Comment = require("../models/Comment.js");
var Match = require("../models/Match.js");
var middleware = require("../middleware");


router.get("/comments/:id",  middleware.isLoggedIn, function(req,res){
    Match.findById(req.params.id).populate("comments").exec(function(err,match){
        if(err){
            console.log("error");
        } else {
        res.render("comments",{match:match});
        }
    });
});

router.get("/addComments/:id",  middleware.isLoggedIn, function(req,res){
    Match.findById(req.params.id,function(err,match){
        if(err){
            console.log("error");
        } else {
        console.log("Found:" + match);
        res.render("addComments",{match : match});
        }
    });
});

router.post("/addComments/:id",  middleware.isLoggedIn, function(req,res){
    Match.findById(req.params.id, function(err,match){
        if(err){
            console.log("Error");
        } else {
        Comment.create(req.body.comment, function(err,comment){
            if (err){
                console.log("Error");
            } else {
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                comment.date = Date.now();
                comment.save();
                match.comments.push(comment);
                match.save();
                req.flash("success", "Comment successfully added");
                res.redirect("/comments/" + req.params.id);
            }
        })
        }
    });
});

router.delete("/commentDelete/:id",  middleware.isLoggedIn, function(req, res){
    Comment.findByIdAndRemove(req.params.id, function(err){
        if (err) {
            console.log("Error");
        } else {
        req.flash("success", "File successfully removed");
        res.redirect("back");
        }
    });
});


module.exports = router;