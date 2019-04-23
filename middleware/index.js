var User = require("../models/user.js");

var middlewareObj = {};

middlewareObj.isLoggedIn = function isLoggedIn (req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You must be logged in to access this page");
    res.redirect("/");
};

middlewareObj.isAdministrator = function isAdministrator (req,res,next){
    if(!req.isAuthenticated()){
            req.flash("error", "You must be logged in to access this page");
            return res.redirect("/");
        } else {
            if (req.user.isAdmin){
            return next();
        } else {
        req.flash("error", "Only the Adminstrator can access that page");
        res.redirect("season_prac");
        } 
    }
 };

module.exports = middlewareObj;