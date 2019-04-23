var express = require("express");
var router = express.Router();
var passport = require("passport");
var emailRegister = require("../emailRegister");
var User = require("../models/user.js");
// ===============================
// AUTHENTICATION ROUTES

router.get("/", function(req, res) {
    res.render("login");
});

router.get("/preRegister", function(req,res){
    res.render("preRegisterPassword");
});

var teamPword = process.env.TEAMPASSWORD;
var adminPword = process.env.ADMINPASSWORD;

router.post("/preRegister", function(req,res){
  var teamPassword = req.body.teamPassword;
  if (teamPassword === adminPword){
      res.render("register", {isAdmin:true})
  }
  if (teamPassword === teamPword){
    req.flash("success", "You can now enter your registration details");
    res.redirect("/register");
  } else {
    req.flash("error", "The password did not match the one provided by your team captain. Try again.");
    res.redirect("/preRegister");
  }
});

router.get("/register", function(req,res){
    res.render("register", {isAdmin:false});
});

router.post("/register", function(req,res){
    var newUser= new User({username: req.body.username, email: req.body.email, isAdmin: req.body.isAdmin});
    User.register(newUser, req.body.password, function(err,user){
        if (err){
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/register");
        }
            passport.authenticate("local")(req, res, function(){
            req.flash("success", "Thanks for registering " + user.username);
                var password= process.env.GMAILPWD;
                var sendTo= "wdouglasfairlie@gmail.com";
                var Subject = "New Registration";
                var Text = req.body.username + " just registered.";
                emailRegister(password, sendTo, Subject, Text);
            res.redirect("/season_prac");
        });
    });
});

router.post("/login", passport.authenticate("local",{
    successRedirect: "/season_prac",
    failureRedirect: "/",
    successFlash: "Welcome back!",
    failureFlash: true,
    }), function(req,res){
});
   
router.get("/logout", function(req,res){
    req.logout();
    req.flash("success", "Successfully logged-out");
    res.redirect("/");
});


module.exports = router;