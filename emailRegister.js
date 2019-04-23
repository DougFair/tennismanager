var mongoose = require("mongoose");
var nodemailer = require('nodemailer');


var emailRegister = function(password, sendTo, Subject, Text){
  console.log("sendTo: " + sendTo);
  console.log("Subject: " + Subject);
  console.log("Text: " + Text);
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'wdouglasfairlie@gmail.com',
    pass: password
  }
});

var mailOptions = {
  from: 'wdouglasfairlie@gmail.com',
  to: sendTo,
  subject: Subject,
  text: Text,
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

};

module.exports = emailRegister;