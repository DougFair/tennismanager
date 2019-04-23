var mongoose = require("mongoose");


var emailAddresses=[]; 
users.forEach(function(user){ 
   if (!user.email == ""){
   emailAddresses.push(user.email)
   }
   });
var emailList = emailAddresses.toString();
console.log("Email admin" + emailList);