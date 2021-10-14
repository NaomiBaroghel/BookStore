let path = require('path');
//let fetch = require("node-fetch");
let bodyParser = require('body-parser')


let express = require('express');
const fileUpload = require('express-fileupload');
const multer = require('multer');
let booklibrary = require ("./booklibrary/books.js");

let app = express();



app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());


// support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

app.use(fileUpload());//to upload file


var jsonParser = bodyParser.json()



app.post('/insertBook', jsonParser, async function(req, res) {

console.log('insertbook');
console.log(req.body);
var result  = await booklibrary.data.insertBook(req.body);


if(result=="OK")
{
  console.log("OK");
  res.status(200).send({"message":"New Book successfuly inserted to the database !"});
}
else {
  console.log("NOT OK");
  res.status(400).send({"message":"Error while attempting to insert the new book. Please try again."});
}


});

app.post('/updateBook', jsonParser, async function(req, res) {


console.log(req.body);
var result  = await booklibrary.data.updateBook(req.body);


if(result=="OK")
{
  console.log("OK");
  res.status(200).send({"message":" Book successfuly updated to the database !"});
}
else {
  console.log("NOT OK");
  res.status(400).send({"message":"Error while attempting to update new book. Please try again."});
}


});

app.post('/uploadCover', async function(req, res) {
  console.log("in uploadCover");
  //console.log(req);
  console.log(req.files);
  console.log(req.body);

 var book_cover=req.files.book_cover
  console.log(__dirname)
  let urlimage=""
  let filepath = 'images/bookCover/' +req.body.id+"_book_cover."+book_cover.name.split('.')[1]
  let fullfilepath = __dirname + '/public/' +filepath

  let result = await book_cover.mv(fullfilepath);
  console.log("uploded");
  console.log(filepath);

  res.status(200).send({"book_cover":filepath});

});



app.get('/getAllBooks', async function(req, res) {
  var all_books  = await booklibrary.data.getAllBooks();

  res.status(200).send({all_books});


});

app.get('/getAuthors', async function(req, res) {
  var list_authors  = await booklibrary.data.getAuthors();

  res.status(200).send({list_authors});

});

app.get('/getEditions', async function(req, res) {
  var list_editions  = await booklibrary.data.getEditions();

  res.status(200).send({list_editions});

});

app.get('/newid', async function(req, res) {
  var newid  = await booklibrary.data.newid();
console.log(newid);
  res.status(200).send({newid});
});


app.post('/searchByValue',jsonParser, async function(req, res) {
  var listbooksearched  = await booklibrary.data.searchByValue(req.body.search_value);
console.log(listbooksearched);
  res.status(200).send({listbooksearched});
});

app.post('/searchByFilter',jsonParser, async function(req, res) {
  console.log("searchByFilterServer");
  var listbooksearched  = await booklibrary.data.searchByFilter(req.body.search);
console.log(listbooksearched);
  res.status(200).send({listbooksearched});
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
