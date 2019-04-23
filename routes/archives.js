var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");

var Opponent = require("../models/Opponent.js");
var SeasonPlayer = require("../models/SeasonPlayer.js");
var Archive = require("../models/Archive.js");
var Note = require("../models/Note.js");
var Match = require("../models/Match.js");
var Comment = require("../models/Comment.js");
var archiveMatch = require("../archiveMatch");
var middleware = require("../middleware");

router.post("/archiveCurrent", middleware.isLoggedIn, function(req,res){
var ladder = [];
  Opponent.find({}, function(err, opponent){
    if (err){
    console.log("Error");
    } else {
        opponent.forEach(function(opponent){
            var position = opponent.position;
            var team = opponent.team;
        ladder.push({position:position, team:team});
        });
        }
    });
var year;
var season;
var teamMembers;
          SeasonPlayer.find({},function (err, seasonPlayer){
            seasonPlayer.forEach(function(seasonItem){
             year = seasonItem.year;
             season = seasonItem.season;
             teamMembers = seasonItem.teamMembers;
            });
            if (err){
                console.log("Error");
            } else {
            Match.find({}, function (err, allMatches){
                if (err){
                    console.log("Error");
                        } else {
                    archiveMatch.details(allMatches, function (matches){
                    Archive.create({ladder:ladder, season:season, year: year, teamMembers:teamMembers, details:matches}, function (err,allMatches){
                    if (err){
                        console.log("Error");
                        } else { 
                        res.render("deleteCollections",{allMatches:allMatches}) ;
                            }
                        });
                    });
                }
            });
        }
    });
});



router.post("/archivePast", middleware.isLoggedIn, function(req,res){
    Archive.create({season:req.body.season, year:req.body.year, section:req.body.section}, function(err,archivedSeason){
        if (err){
            console.log("Error");
        } else {
            res.render("archivePastInput",{archivedSeason:archivedSeason});
        }
    });
});


router.put("/archivePastPlayers/:id", middleware.isLoggedIn, function(req,res){
    var player = req.body.player;
    Archive.findByIdAndUpdate(req.params.id, {$push:{teamMembers:player}}, function(err, archivedSeason){
    if (err){
        console.log("Error");
    } else {
        Archive.findById(req.params.id, function(err, archivedSeason){
        if (err){
            console.log("Error");
        } else {
        res.render("archivePastInput",{archivedSeason:archivedSeason});
                }
            });
        }
    });
});

router.put("/archivePastTeam/:id", middleware.isLoggedIn, function(req,res){
    var team = req.body.team;
    Archive.findByIdAndUpdate(req.params.id, {$push:{teams:team}}, function(err, archivedSeason){
    if (err){
        console.log("Error");
    } else {
        Archive.findById(req.params.id, function(err, archivedSeason){
        if (err){
            console.log("Error");
        } else {
        res.render("archivePastInput",{archivedSeason:archivedSeason});
                }
            });
        }
    });
});

router.put("/archivePastLadder/:id", middleware.isLoggedIn, function(req,res){
    var team = req.body.team;
    var position = req.body.position;
    var teamPosObj = {position:position, team:team};
    Archive.findByIdAndUpdate(req.params.id, {$push:{ladder:teamPosObj}}, function(err, archivedSeason){
    if (err){
        console.log("Error");
    } else {
        Archive.findById(req.params.id, function(err, archivedSeason){
        if (err){
            console.log("Error");
        } else {
        res.render("archivePastInput",{archivedSeason:archivedSeason});
                }
            });
        }
    });
});


router.put("/archivePastDetails/:id", middleware.isLoggedIn, function(req,res){
    var playersArray = [];
    playersArray.push(req.body.archivePast.player_1, req.body.archivePast.player_2, req.body.archivePast.player_3,req.body.archivePast.player_4);
    Archive.findByIdAndUpdate(req.params.id,{$push:{details: {$each:[ 
                                                    {date:req.body.archivePast.date,
                                                    round:req.body.archivePast.round,
                                                    homeTeam:req.body.archivePast.homeTeam,
                                                    awayTeam:req.body.archivePast.awayTeam,
                                                    score:req.body.archivePast.score,
                                                    players:playersArray}]
    }}}, function(err, archivedSeason){
    if (err){
        console.log("Error1");
    } else {
        Archive.findById(req.params.id, function(err, archivedSeason){
        if (err){
            console.log("Error");
        } else {
        res.render("archivePastInput",{archivedSeason:archivedSeason});
                }
            });
        }
    });
});


router.get("/pastSeasonsArchive", middleware.isLoggedIn, function(req,res){
    Archive.find({}, function(err, archivedSeasons){
        if (err){
            console.log("Error");
        } else {
            res.render("pastSeasonsArchive", {archivedSeasons:archivedSeasons});
        }
    });
});


router.post("/archiveDisplay/:id", middleware.isLoggedIn, function(req,res){
    Archive.findById(req.params.id, function (err, archivedSeason){
           if (err){
               console.log("Error");
           } else {
            res.render("archiveDisplay",{allMatches:archivedSeason});
           }
    });

});

router.get("/archivePlayerEdit/:id", middleware.isLoggedIn, function(req,res){
    Archive.findById(req.params.id, function (err, archivedSeason){
           if (err){
               console.log("Error");
           } else {
            res.render("archivePlayerEdit",{allMatches:archivedSeason});
           }
    });
});

router.put("/archivePlayerEdit/:id", middleware.isLoggedIn, function(req,res){
    Archive.findByIdAndUpdate(req.params.id, {$pull:{teamMembers: req.body.player}},function (err, archivedSeason){
        if (err){
            console.log("Error");
        } else {
        Archive.findById(req.params.id, function(err, archivedSeason){
        if (err){
            console.log("Error");
        } else {
        res.render("archivePastInput",{archivedSeason:archivedSeason});
                }
            });
        }
    });
});

router.get("/archiveOpponentEdit/:id", middleware.isLoggedIn, function(req,res){
    Archive.findById(req.params.id, function (err, archivedSeason){
           if (err){
               console.log("Error");
           } else {
            res.render("archiveOpponentEdit",{allMatches:archivedSeason});
           }
    });
});

router.put("/archiveOpponentEdit/:id", middleware.isLoggedIn, function(req,res){
    console.log("Team" + req.body.team);
    Archive.findByIdAndUpdate(req.params.id, {$pull:{teams: req.body.team}},function (err, archivedSeason){
        if (err){
            console.log("Error");
        } else {
        Archive.findById(req.params.id, function(err, archivedSeason){
        if (err){
            console.log("Error");
        } else {
        res.render("archivePastInput",{archivedSeason:archivedSeason});
                }
            });
        }
    });
});

router.get("/archiveLadderEdit/:id", middleware.isLoggedIn, function(req,res){
    Archive.findById(req.params.id, function (err, archivedSeason){
           if (err){
               console.log("Error");
           } else {
            res.render("archiveLadderEdit",{allMatches:archivedSeason});
           }
    });
});

router.put("/archiveLadderEdit/:id", middleware.isLoggedIn, function(req,res){
    Archive.findByIdAndUpdate(req.params.id, {$pull: { ladder: { team:req.body.team, position:req.body.position }}}, function(err, archivedSeason){
    if (err){
        console.log("Error");
    } else {
        Archive.findById(req.params.id, function(err, archivedSeason){
        if (err){
            console.log("Error");
        } else {
        res.render("archivePastInput",{archivedSeason:archivedSeason});
                }
            });
        }
    });
});


router.get("/archiveDisplayEdit/:id", middleware.isLoggedIn, function(req,res){
    Archive.findById(req.params.id, function (err, archivedSeason){
           if (err){
               console.log("Error");
           } else {
            res.render("archiveDisplayEdit",{allMatches:archivedSeason});
           }
    });

});

router.post("/archiveEditForm/:id", middleware.isLoggedIn, function(req,res){
    var round = req.body.round;
    var homeTeam;
    var awayTeam;
    var date; 
    var score;
    var player1;
    var player2;
    var player3;
    var player4;
    Archive.findById(req.params.id, function (err, archivedRound){
           if (err){
               console.log("Error");
           } else {
               archivedRound.details.forEach(function(match){
               if (match.round == round) {
                var homeTeam = match.homeTeam;
                console.log("hometeam" + homeTeam)
                var awayTeam = match.awayTeam;
                var date = match.Date;
                var score = match.score;
                var player1 = match.players[0];
                var player2 = match.players[1];
                var player3 = match.players[2];
                var player4 = match.players[3];
                res.render("archiveEdit",{id: req.params.id, round:round, homeTeam:homeTeam,awayTeam: awayTeam,date:date, score:score,player1:player1,player2:player2, player3:player3, player4:player4 });
               }
               });
    
           }
    });

});

router.put("/archivePastDetailsUpdate/:id", middleware.isLoggedIn, function(req,res){
    var newDetailsObj = {};
    var playersArray = [];
    playersArray.push(req.body.archivePast.player_1, req.body.archivePast.player_2, req.body.archivePast.player_3,req.body.archivePast.player_4);
    newDetailsObj.date = req.body.archivePast.date;
    newDetailsObj.round = req.body.archivePast.round;
    newDetailsObj.score= req.body.archivePast.score;
    newDetailsObj.homeTeam= req.body.archivePast.homeTeam;
    newDetailsObj.awayTeam= req.body.archivePast.awayTeam;
    newDetailsObj.players = playersArray;

    Archive.findByIdAndUpdate(req.params.id,{$pull:{details: {round: req.body.archivePast.round}}}, function(err, archivedSeason){
    if (err){
        console.log("Error1");
    } else {
    Archive.findByIdAndUpdate(req.params.id,{$push:{"details": newDetailsObj}}, function(err, archivedSeason){
    if (err){
        console.log("Error1");
    } else {
        Archive.findById(req.params.id, function(err, archivedSeason){
        if (err){
            console.log("Error");
        } else {
        res.render("archiveDisplay",{allMatches:archivedSeason});
                    }
                });
            }
        });
    }
});
});



router.delete("/archiveDelete/:id", middleware.isAdministrator, function(req,res){
    Archive.findByIdAndRemove(req.params.id, function (err, archivedSeason){
           if (err){
               console.log("Error");
           } else {
            res.redirect("/pastSeasonsArchive");
           }
    });

});


router.post("/deleteCollections", middleware.isLoggedIn, function(req,res){
    Opponent.deleteMany({}, function(err){
        if (err){
            console.log("Error");
        } else {    
    SeasonPlayer.deleteMany({}, function(err){
        if (err){
            console.log("Error");
        } else {
    Match.deleteMany({}, function(err){
        if (err){
            console.log("Error");
        }  else {
    Note.deleteMany({}, function(err){
    if (err){
        console.log("Error");
        }  else {
    Comment.deleteMany({}, function(err){
    if (err){
        console.log("Error");
    }  else {
        res.redirect("/pastSeasonsArchive");
    }
                                    }); 
                                }
                            }); 
                        }
                    });
                }
            });
        }
    });
});


module.exports = router;