var express = require("express");
var router = express.Router();

var emailer = require("../emailer");
var Match = require("../models/Match.js");
var Opponent = require("../models/Opponent.js");
var User = require("../models/user.js");
var SeasonPlayer = require("../models/SeasonPlayer.js");
var middleware = require("../middleware");

router.get("/create",middleware.isAdministrator, function (req,res){
  SeasonPlayer.find({}, function(err, seasonPlayer){
  if (err) {
      console.log("There is an error");
  }
  else {
      Opponent.find({}, function(err, allOpponents){
      if (err){
          console.log("There is an error");
         } 
        else {
        Match.find({}, function(err, matches){
      if (err){
          console.log("There is an error");
         } 
            else { 
          res.render("create", {seasonPlayer: seasonPlayer, opponents: allOpponents, matches:matches});
                    }
                });
            }
        });
      }
    });
});


router.get("/matchesEdit", middleware.isAdministrator, function(req,res){
    Match.find({}, function(err,matches){
        if (err){
            console.log("Error");
        } else {
            res.render("matchesEdit", {matches:matches});
        }
    });
});

router.put("/matchesEdit/:id", middleware.isAdministrator, function(req,res){
    Match.findByIdAndUpdate(req.params.id, req.body.match, function(err, matches){
        if (err){
            console.log("Error");
        } else {
            res.redirect("/matchesEdit");
        }
    });
});

router.delete("/matchesEdit/:id", middleware.isAdministrator, function(req,res){
    Match.findByIdAndRemove(req.params.id, req.body.match, function(err, matches){
        if (err){
            console.log("Error");
        } else {
            res.redirect("/matchesEdit");
        }
    });
})


router.put("/matchesEditFinal", middleware.isAdministrator, function(req,res){
      Match.updateMany({}, {$set: {updated: false}},function (err, matches){
         if(err){
             console.log(err);
         } else {
             res.redirect("season_prac");
         }
    });
 });  
     
router.post("/seasonPlayer", middleware.isAdministrator, function(req,res){
   SeasonPlayer.find({}, function(err, current){
       if (err){
           console.log("error");
       } 
        if (current.length > 0){
         req.flash("error", "There is a season currently active. Please archive before creating a new season");
         res.redirect("/admin");
       } else if (!req.body.season.year || !req.body.season.season){
        req.flash ("error", "Please enter a year and/or season for the season you wan to create");
        res.redirect("/admin");
        } else {
        SeasonPlayer.create(req.body.season, function (err, seasonPlayer){
        if(err){
            console.log("Error");
        } else {
            res.redirect("/create");
                }
            });
        }
    });
});

router.put("/teamMembers/:id", middleware.isAdministrator, function(req,res){
    SeasonPlayer.findByIdAndUpdate(req.params.id, {$push:{teamMembers: req.body.player}}, function (err, player){
        if(err){
            console.log("Error");
        } else {
            res.redirect("/create");
        }
    });
});

router.get("/teamMemberEdit",middleware.isAdministrator, function(req,res){
    SeasonPlayer.find({}, function (err, season){
        if(err){
            console.log("Error");
        } else {
            res.render("editTeamMembers", {season:season});
        }
    });
});

router.put("/teamMembersEdit/:id", middleware.isAdministrator, function(req,res){
    SeasonPlayer.findByIdAndUpdate(req.params.id, {$pull:{teamMembers: req.body.player}}, function (err, player){
        if(err){
            console.log("Error");
        } else {
            res.redirect("/create");
        }
    });
});

router.delete("/editOpponent/:id", middleware.isAdministrator, function(req,res){
    Opponent.findByIdAndRemove(req.params.id, function (err, opponent){
        if(err){
            console.log("Error");
        } else {
            res.redirect("/create"); 
        }
    });
});


router.put("/seasonPlayerEdit/:id", middleware.isAdministrator, function(req,res){
    SeasonPlayer.findByIdAndUpdate(req.params.id, {edited: req.body.edited}, function (err, player){
        if(err){
            console.log("Error");
        } else {
            res.redirect("/create");
        }
    });
});


router.post("/postCreate", middleware.isAdministrator, function(req,res){
    Match.create(req.body.match, function (err, match){
        if(err){
            console.log("Error");
        } else {
            res.redirect("/create"); 
        }
    });
});

router.post("/postOpponent", middleware.isAdministrator, function(req,res){
    Opponent.create(req.body.opponent, function (err, opponent){
        if(err){
            console.log("Error")
        } else {
            res.redirect("/create"); 
        }
    });
});

router.get("/editOpponent", middleware.isAdministrator, function(req,res){
    Opponent.find({}, function (err, opponents){
        if(err){
            console.log("Error");
        } else {
            res.render("editOpponent", {opponents:opponents}); 
        }
    });
});

router.delete("/editOpponent/:id", middleware.isAdministrator, function(req,res){
    Opponent.findByIdAndRemove(req.params.id, function (err, opponent){
        if(err){
            console.log("Error");
        } else {
            res.redirect("/create"); 
        }
    });
});


router.get("/admin", middleware.isAdministrator, function(req,res){
    SeasonPlayer.find({}, function(err,season){
        if (err){
            console.log("Error");
        } else {
    User.find({}, function (err, users){
          if (err){
             console.log("Error");
          } else {
            res.render("admin", {users : users, season:season});   
                }
            });
        }
    });
});

router.get("/scoreUpdate", middleware.isAdministrator, function(req,res){
    res.render("scoreUpdate");
});

router.put("/scoreUpdate", middleware.isAdministrator, function(req,res){
    if (!req.body.round || !req.body.score ) {
        req.flash("error", "Your did not input a round and/ or score to update");
        res.redirect("scoreUpdate");
    } else {
    Match.findOneAndUpdate({round:req.body.round}, {$set: {score: req.body.score}},function (err, updatedScore){
        if (err){
            console.log("Error");
        } else {
            req.flash("success", "Score for round " + req.body.round + " succesfully updated");
            res.redirect("season_prac");
            }
        });
    }
});


router.post("/addPlayers", middleware.isAdministrator, function(req,res){
    var round = req.body.playerAddRound;
    if (!round) {
        req.flash("error", "Please enter the round for which you want to add a player");
        res.redirect("/admin");
    } else {
       Match.findOne({round:round}, function(err, match){
           if(err){
               console.log("Error");
           } else {
             res.render("addPlayers", {round:round, match: match}); 
           }
       });
    }
});

router.put("/addPlayers", middleware.isAdministrator,function(req,res){
    var player = req.body.player;
    var round = req.body.round;
    if (req.body.player === ""){
        Match.findOne({round:round}, function(err, match){
            if(err){
                console.log("Error");
            } else{
             res.render("addPlayers", {round:round, match:match, error: "You didn't enter a name!"});
            }
            });
            } else {
        Match.findOneAndUpdate({round:round}, {$push:{players: player}},function (err, addedPlayer){
            if (err){
                console.log("Error");
            } else {
                Match.findOne({round:round}, function(err, match){
                    console.log("Players: " + match.player);
                    if (err){
                        console.log("Error");
                    } else {
                    res.render("addPlayers", {round:round, match:match, success: "Player successfully added"});
                    } 
                });
            }
        });
    }
});

router.post("/emailTeam", middleware.isAdministrator, function (req,res){
    var players = req.body.players;
    Match.findOne({round: req.body.round}, function(err, match){
        if (err){
            console.log("Error");
        } else {
    var nextTeam = match.homeTeam;
    var sendTo = req.body.emailList;
    var Subject = "Team for this week";
   
    if (nextTeam === "Montmorency"){
    var Text = "Gents - next game is home versus " + match.awayTeam + ". Players are " + players + ".\n See you Thursday! \nDoug";
    } else {
    var Text = "Gents - next game is away versus " + match.homeTeam + ". Players are " + players + ".\n See you Thursday! \nDoug";
    }
    res.render("email", {sendTo:sendTo, Subject:Subject, Text:Text});
    }
    });
});

router.post("/emailPassword", middleware.isAdministrator, function (req,res){
    var password= req.body.password;
    var sendTo= req.body.sendTo;
    var Subject = req.body.Subject;
    var Text = req.body.Text;
    emailer(password, sendTo, Subject, Text);
    req.flash("success", "Email to team successfully sent!");
    res.redirect("/season_prac");
});

router.post("/editPlayers", middleware.isAdministrator, function(req,res){
    var round = req.body.playerEditRound;
    if (!round) {
        req.flash("error", "Please enter the round for which you want to edit / update a player");
        res.redirect("/admin");
    } else { 
        Match.findOne({round:round}, function(err, match){
           if(err){
               console.log("Error");
           } else {
             res.render("editPlayers", {match: match}); 
           }
       });
    }
});


router.put("/deletePlayers/:id", middleware.isAdministrator, function (req,res){
    Match.findByIdAndUpdate(req.params.id, {$pull:{players:req.body.deletedPlayer}}, function(err,match){
    if (err) {
        console.log("Error");
    } else { Match.findById(req.params.id, function (err, updatedMatch){
        if (err){
            console.log("error");
        } else {
        res.render("editPlayers", {match:updatedMatch, success: "Player successfully deleted"}); 
        }
        });
    }
    }); 
});

 module.exports = router;