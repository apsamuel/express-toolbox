var express  = require('express');
var formidable = require('formidable');
var app = express()
var fs = require('fs');
var os = require('os');
var path = require('path');
util = require('util');
var router = express.Router();
const uploadDir = "uploads/";

//setup templating and CSS
app.use(express.static('public'));
app.set('view engine', 'ejs');



app.get('/', function (req, res){
  res.render('index');
});

//handle the call back for public.
app.get('/public/:filename', function(req, res){
  res.sendFile(path.resolve("public/"+ req.params.filename));
});

//handle the call back for images.
app.get('/uploads/:filename', function(req, res){
  res.sendFile(path.resolve("uploads/"+ req.params.filename));
});

app.post('/', function(req, res){

  var form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.uploadDir = "uploads/";

  //parse posted form data
  form.parse(req, (err, fields, files) => {
    if (err) return res.status(500).json({ error: err })
    console.log(util.inspect({fields: fields, files: files}));
    res.status(200).render('uploaded', {thefile: files.file.name, thepath: files.file.path });
  });

  //when user clicks submit,
  //yank the file uploaded,
  //rename it with ORIG_<timestamp>,
  //.. and place it in the upload directory
  form.on('fileBegin', function(name, file) {
    const [fileName, fileExt] = file.name.split('.') ;
    console.log("filename: " +fileName);
    console.log("fileExt: "+fileExt);
    file.path = path.join(uploadDir, `${fileName}_${new Date().getTime()}.${fileExt}`);
    console.log("filePath: "+file.path);
  });

  form.on('file', function(name, file){
    console.log('Uploaded ' + file.name);
  });

});

app.listen(3000, () => console.log('Example app listening on port 3000!'))
