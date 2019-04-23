var mongoose = require("mongoose");
var seasonList=[];

module.exports = {
    details : function(allMatches, callback){
    allMatches.forEach(function(match){
    var roundObj = {
    round: match.round, 
    date:match.date, 
    homeTeam:match.homeTeam, 
    awayTeam: match.awayTeam, 
    players:match.players,
    score: match.score
    };
    seasonList.push(roundObj);
    });
    callback(seasonList);
    }
};



