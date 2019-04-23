
module.exports = {
    away: function (matches,callback){
    matches.forEach(function(match){
    if (match.round === 1){
    callback(match.awayTeam);
    }
});
}
};
