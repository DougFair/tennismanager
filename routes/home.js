var express = require("express");

var router = express.Router();
var Opponent = require("../models/Opponent.js");
var SeasonPlayer = require("../models/SeasonPlayer.js");
var Note = require("../models/Note.js");
var Match = require("../models/Match.js");
var User = require("../models/user.js");
var middleware = require("../middleware");

router.get("/season_prac", middleware.isLoggedIn, function(req,res){
    Match.find({}, function(err, allMatches){
        if (err){
            console.log("There is an error");
        } else {
            Opponent.find({}, function(err, allOpponents){
        if (err){
          console.log("There is an error");
         } else {
            Note.find({}, function(err, notes){
        if (err) {
            console.log("Error");
        } else {
            SeasonPlayer.find({}, function(err, season){
        if (err) {
            console.log("Error");
        } else {
            res.render("season_prac", {season:season, matches: allMatches, opponents: allOpponents, notes:notes});
                                } 
                            });
                        }
                    });
                }
            });
        }
    });
})       

router.put("/canPlay/:id", middleware.isLoggedIn, function(req,res){
    var canPlay = req.body.match.canPlay;
           Match.findById(req.params.id, function(err,match){
                if(err){
                    console.log(err);
                } else {
                    if (match.canPlay.includes(req.user.username)){
                        req.flash("warning", "You have already previously indicated you can play that round.");
                        res.redirect("/season_prac");
                    } else Match.findByIdAndUpdate(req.params.id, {$push:{canPlay:canPlay}}, function(err,updatedMatch){
                        if(err){
                            console.log("Error happened");
                    } else {
                        req.flash("success", "Your availability has been updated.");
                        console.log(updatedMatch);
                    }
                    if (!match.unavailable.includes(req.user.username)){
                        res.redirect("/season_prac");
                    } else Match.findByIdAndUpdate(req.params.id, {$pull:{unavailable:canPlay}}, function(err,updatedMatch){
                        if(err){
                            console.log("Error happened");
                    } else {
                        req.flash("success", "Your availability has been updated.");
                        res.redirect("/season_prac");
                    }
                });
            });
        }
    });
});
 
router.put("/unavailable/:id", middleware.isLoggedIn, function(req,res){
        var unavailable = req.body.match.unavailable;
           Match.findById(req.params.id, function(err,match){
                if(err){
                    console.log(err);
                } else {
                    if (match.unavailable.includes(req.user.username)){
                        req.flash("warning", "You have already previously indicated you can't play that round.");
                        res.redirect("/season_prac");
                    } else Match.findByIdAndUpdate(req.params.id, {$push:{unavailable:unavailable}}, function(err,updatedMatch){
                        if(err){
                            console.log("Error happened");
                    } else {
                        req.flash("success", "Your availability has been updated.");
                    }
                    if (!match.canPlay.includes(req.user.username)){
                        res.redirect("/season_prac");
                    } else Match.findByIdAndUpdate(req.params.id, {$pull:{canPlay:unavailable}}, function(err,updatedMatch){
                        if(err){
                            console.log("Error happened");
                    } else {
                        req.flash("success", "Your availability has been updated.");
                        res.redirect("/season_prac");
                    }
                });
            });
        };
    });
});

router.put("/removeAvail/:id", middleware.isLoggedIn, function(req,res){
        var removeName = req.body.match.removeName;
           Match.findById(req.params.id, function(err,match){
                if(err){
                console.log(err);
                } 
                if (!match.unavailable.includes(req.user.username) && !match.canPlay.includes(req.user.username)){
                    req.flash("warning", "You had not indicated you can't play that round.");
                    res.redirect("/season_prac");
                } else {
                
                if (match.unavailable.includes(req.user.username)){
                        Match.findByIdAndUpdate(req.params.id, {$pull:{unavailable:removeName}}, function(err,updatedMatch){
                        if(err){
                            console.log("Error happened");
                        } else {
                        req.flash("success", "Your availability has been updated.");
                        res.redirect("/season_prac");
                        } 
                        });
                }

                if (match.canPlay.includes(req.user.username)){
                     Match.findByIdAndUpdate(req.params.id, {$pull:{canPlay:removeName}}, function(err,updatedMatch){
                        if(err){
                            console.log("Error happened");
                    } else {
                        req.flash("success", "Your availability has been updated.");
                        res.redirect("/season_prac");
                        }
                    });
                }
    
                }          
    });
});




module.exports = router;