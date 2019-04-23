var express = require("express");
var router = express.Router();
var Opponent = require("../models/Opponent.js");
var SeasonPlayer = require("../models/SeasonPlayer.js");
var User = require("../models/user.js");
var middleware = require("../middleware");


router.get("/ladder", middleware.isLoggedIn, function(req,res){
    SeasonPlayer.find({}, function(err, season){
        if (err) {
            console.log("Error");
        } else {
    Opponent.find({}, function(err, opponents){
        if (err){
            console.log("There is an error");
        }
        if (!opponents.length){
            req.flash("error", "No ladder currently available");
            return res.redirect("/season_prac");
        } else {
            var posArr = [];
            for (var i=0; i < opponents.length; i++) {
                if (!opponents[i].position){
                posArr.push(i);
                }
            }
        } 
            if (posArr.length) {
                req.flash("error", "No ladder currently available");  
                res.redirect("/season_prac"); 
            } else {
            res.render("ladder", {season:season, opponents: opponents});
                }
            });
        }
    });
});
        
router.get("/ladderedit", middleware.isLoggedIn, function(req,res){
    Opponent.find({}, function(err, opponents){
        if (err){
            console.log("There is an error");
        } else {
          res.render("ladderedit", {opponents: opponents});
        }
      });
});

router.put("/ladderedit/:id", middleware.isLoggedIn, function(req,res){
        Opponent.findByIdAndUpdate(req.params.id, req.body.opponent, function(err,updatedOpponent){
            if(err){
                console.log(err);
            } else {        
                res.redirect("/ladderedit");
            }
        });
    });
     
router.put("/laddercorrect", middleware.isLoggedIn, function(req,res){
     Opponent.updateMany({}, {$set: {updated: true}},function (err, updatedOpponents){
         if(err){
             console.log(err);
         } else {
             req.flash("error", "Please ensure there is a different team for each ladder position.")
             res.redirect("/ladderedit");
         }
    });
 }); 

router.put("/laddereditfinal", middleware.isLoggedIn, function(req,res){
      Opponent.updateMany({}, {$set: {submitted: true, updated: false, dateUpdated: Date.now()}},function (err, updatedOpponents){
         if(err){
             console.log(err);
         } else {
             res.redirect("ladder");
         }
    });
 });  
 
 middleware.isLoggedIn
 
 module.exports = router;