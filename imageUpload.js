var express = require("express");
var aws = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3');
var bodyParser = require('body-parser');
var app = express();

aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-2',
});

app.use(bodyParser.json());

var s3 = new aws.S3();

var upload = multer({
  storage: multerS3({
    acl: 'public-read',
    s3:s3,
    bucket: process.env.S3_BUCKET,
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      var fileName = Date.now().toString() + "-" + file.originalname;
      cb(null, fileName);
    }
  })
});

module.exports = upload