var express = require('express');
var path = require('path');
var sizeOf = require('image-size');


//setup aws
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./awsconfig.json');

//setup multer for file upload
var multer  = require('multer');
var storage = multer.memoryStorage()
var upload = multer({ storage: storage });

//allow loading a single file
var type = upload.single('sampleFile');

var app = express();
app.set('view engine', 'ejs');

var rekognition = new AWS.Rekognition();

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/upload', type, function (req,res) {
  console.log(req.body); //form fields
  console.log(req.file); //form files

  var dimensions = sizeOf(req.file.buffer);
  console.log(dimensions.width, dimensions.height);

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
      console.log(data.FaceDetails);
//      console.log(data.FaceDetails[0]);

      var leftEye = data.FaceDetails[0].Landmarks.find(o => o.Type === 'eyeLeft');
      var rightEye = data.FaceDetails[0].Landmarks.find(o => o.Type === 'eyeRight');

      var faceDetails = data.FaceDetails[0];
    }
  
  //res.send('<img src="data:image/gif;base64,' + base64image + '" style="max-height: 400px; max-width: 400px;" />');
  var imageSrc = 'data:image/gif;base64,' + base64image;
  res.render('upload', { title: 'Hey', uploadedImage: imageSrc, low: faceDetails.AgeRange.Low, high: faceDetails.AgeRange.High, smile: faceDetails.Smile, emotion: faceDetails.Emotions[0], beard: faceDetails.Beard, leftEye: leftEye, rightEye: rightEye, imageWidth: dimensions.width, imageHeight: dimensions.height});
  });
  
  //res.status(204).end();
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
