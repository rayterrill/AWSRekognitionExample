var express = require('express');
var path = require('path');

//setup aws
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./awsconfig.json');
AWS.config.update({region:'us-west-2'});

//setup multer for file upload
var multer  = require('multer');
var storage = multer.memoryStorage()
var upload = multer({ storage: storage });

//allow loading a single file
var type = upload.single('sampleFile');

var app = express()

var rekognition = new AWS.Rekognition();

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/upload', type, function (req,res) {
  console.log(req.body); //form fields
  console.log(req.file); //form files
  
  var base64image = new Buffer(req.file.buffer).toString('base64');
  var base64imageForAWS = new Buffer(req.file.buffer, 'base64');
  
  var params = {
   Attributes: ["ALL"],
   Image: {
    Bytes: base64imageForAWS
   }
  };
  
  rekognition.detectFaces(params, function(err, data) {
    if (err) {
      console.log(err, err.stack); // an error occurred
    } else {
      //console.log(data);           // successful response
      console.log(data.FaceDetails[0]);
    }
  });
  
  res.send('<img src="data:image/gif;base64,' + base64image + '" style="max-height: 400px; max-width: 400px;" />');
  //res.status(204).end();
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})