var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var ordinal = require("ordinal");
var moment = require("moment");
var fs = require("fs");
var path = require("path");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var emailer = require("./emailer");
var emailRegister = require("./emailRegister");
var nodemailer = require('nodemailer');
var flash = require("connect-flash");
var ex = require("./Date");
var multer = require("multer");
var multerS3 = require('multer-s3');
var aws = require('aws-sdk');
var archiveMatch = require("./archiveMatch");
var middleware = require("./middleware")

// Requiring models
var Comment = require("./models/Comment.js");
var Match = require("./models/Match.js");
var Archive = require("./models/Archive.js");
var Opponent = require("./models/Opponent.js");
var SeasonPlayer = require("./models/SeasonPlayer.js");
var Player = require("./models/Player.js");
var Note = require("./models/Note.js");
var User = require("./models/user.js");
var Photo = require("./models/Photo.js");
var PDFfile = require("./models/PDFfile.js");

var upload = require('./imageUpload');

// Requiring routes
var homeRoutes = require("./routes/home");
var archiveRoutes = require("./routes/archives");
var commentsRoutes = require("./routes/comments");
var authRoutes = require("./routes/auth");
var mediaRoutes = require("./routes/media");
var ladderRoutes = require("./routes/ladder");
var notesRoutes = require("./routes/notes");
var adminRoutes = require("./routes/admin");


mongoose.connect("mongodb://localhost/team_manager", { useNewUrlParser: true });
// mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true });

// Code so can do upload directly to disk instead of AWS S3 bucket

//     var fileStorage = multer.diskStorage({
//     destination: function(req,file,cb){
//         console.log("mimetype: " + file.mimetype);
//         if (file.mimetype == "application/pdf"){
//         cb(null, "public/pdf");
//         } else {
//         cb(null, "public/images") ;  
//         }
//     },
//     filename: function(req, file, cb){
//         cb(null, new Date().toISOString() + "-" + file.originalname);
//     }
// });

// app.use(multer({storage: fileStorage}).single("file"));

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(methodOverride("_method"));

// Static file pathways when not using Amazon S3
app.use(express.static(__dirname, + "/public"));
app.use("/images",express.static(__dirname, + "/images"));
app.use("/pdf", express.static(__dirname, + "/pdf"));

app.set("view engine", "ejs");
app.use(require("express-session")({
    secret: "Doug is a top bloke",
    resave: false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.warning = req.flash("warning");
    next();
});

app.use(function(req, res, next) {
    var emailAddresses=[];
    User.find({}, function(err, users){
        if (err){
            console.log("error");
        } else {
            users.forEach(function(user){ 
            if (!user.email == ""){
        emailAddresses.push(user.email);
        }
    });
    var emailList = emailAddresses.toString();
    app.locals.emailList = emailList;
    next();
        }
    });
});

// Using routes
app.use(homeRoutes);
app.use(archiveRoutes);
app.use(commentsRoutes);
app.use(authRoutes);
app.use(mediaRoutes);
app.use(ladderRoutes);
app.use(notesRoutes);
app.use(adminRoutes);

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.locals.moment = moment;
app.locals.ordinal = ordinal;

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started");
});
