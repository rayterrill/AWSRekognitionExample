var express = require('express');
var path = require('path');

//setup multer for file upload
var multer  = require('multer');
var storage = multer.memoryStorage()
var upload = multer({ storage: storage });

//allow loading a single file
var type = upload.single('sampleFile');

var app = express()

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/upload', type, function (req,res) {
  console.log(req.body); //form fields
  console.log(req.file); //form files
  res.status(204).end();
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})