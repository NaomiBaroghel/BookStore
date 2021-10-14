const { v4: uuidv4 } = require('uuid');
let fs = require('fs')


var methodes={};
let urlDatabase = './database/books_database.json';
methodes.insertBook= async function (newbook)
{


  //  newbook.book_id= await newid();
  console.log(newbook);
  newbook = JSON.stringify(newbook);




  //append
  fs.readFile(urlDatabase, async function (err, file) {
    if(file)
    {
      var file = file.toString();
      if(file[file.length-1]=="]")
      {
        newbook= ","+newbook+"]";
        console.log(newbook);

        var file = file.substring(0,file.length-1);
        file=file+newbook;
        fs.writeFileSync(urlDatabase, file, function (err) {
          if (err) throw err;
          console.log('File overwrite');
          console.log('The new book was appended to file!');

        });
      }
      else {
        console.log("inesleinsert");
        newbook= "["+newbook+"]";
        console.log(newbook);
        fs.appendFile(urlDatabase, newbook, function (err) {
          if (err) throw err;
          console.log('File created');
          console.log('The new book was appended to file!');
        });


      }


    }



  });
  return "OK";

}

methodes.newid = async function()
{
  console.log("tocreateid");
  var idexist=true;


  var newid="";
  while(idexist==true)
  {
    console.log("dans la boucle");
    var flag = false;
    newid= uuidv4();//create new id
    await fs.readFileSync(urlDatabase, function (err, file) {
      console.log(file);
      if(file && file.length!=0)
      {
        console.log("dans le read");
        var filejson = JSON.parse(file);

        for (var i = 0; i < filejson.length; i++) {

          console.log(filejson[i]);
          if(filejson[i].book_id==newid)
          {
            flag=true;
          }
        }
      }

    })

    if(flag!=true)
    {
      idexist=false;
    }
  }
  return newid;

};


methodes.updateBook = async function (updatebook)
{
  console.log('inupdatebook');
  var filedb=""
  var file = await fs.readFileSync(urlDatabase,'utf8');
  if(file)
  {
    var filejson = JSON.parse(file);

    for (var i = 0; i < filejson.length; i++) {

      if(filejson[i].book_id==updatebook.book_id)
      {
        filejson[i].book_title =updatebook.book_title
        filejson[i].book_author = updatebook.book_author
        filejson[i].book_edition = updatebook.book_edition
        filejson[i].book_price = updatebook.book_price
        filejson[i].book_synopsis = updatebook.book_synopsis
        filejson[i].book_parution = updatebook.book_parution
        filejson[i].book_category = updatebook.book_category
        filejson[i].book_cover = updatebook.book_cover

      }
    }

    filedb = JSON.stringify(filejson)

  }

  console.log(filedb);
  await fs.writeFileSync(urlDatabase, filedb, function (err) {
    if (err) throw err;
    console.log('File overwrite');
    console.log('The book was updated!');

  });

  return "OK";
}

methodes.getAllBooks =  async function ()
{
  var file= await fs.readFileSync(urlDatabase,'utf8');
  return file;
}

methodes.getAuthors =  async function ()
{
  var list_authors=[];
  var file= await fs.readFileSync(urlDatabase,'utf8');
  var filejson = JSON.parse(file);
  for (var i = 0; i < filejson.length; i++) {
    list_authors.push(filejson[i].book_author);
  }
  list_authors = [...new Set(list_authors)];

  return list_authors;
}

methodes.getEditions =  async function ()
{
  var list_editions=[];
  var file= await fs.readFileSync(urlDatabase,'utf8');
  var filejson = JSON.parse(file);
  for (var i = 0; i < filejson.length; i++) {
    list_editions.push(filejson[i].book_edition);
  }
  list_editions = [...new Set(list_editions)];

  return list_editions;
}




methodes.searchByValue = async function (search_value)
{
  console.log(search_value);
  var listbookssearched=[];
  var file= await fs.readFileSync(urlDatabase,'utf8');
  var filejson = JSON.parse(file);
  for (var i = 0; i < filejson.length; i++) {
    console.log(JSON.stringify(filejson[i]));

    if(JSON.stringify(filejson[i]).toLowerCase().includes(search_value.toLowerCase()))
    {

      console.log("find a correspondance");
      console.log(filejson[i]);
      listbookssearched.push(filejson[i])
    }


  }

  console.log(listbookssearched);
  return listbookssearched;

}

methodes.searchByFilter = async function (search)
{
  console.log("searchByFilterBook");

  console.log(search);
  var listbookssearched=[];
  var file= await fs.readFileSync(urlDatabase,'utf8');
  var filejson = JSON.parse(file);
  for (var i = 0; i < filejson.length; i++) {
    let matchFlagCategory=true;
    let matchFlagAuthor=true;
    let matchFlagEdition=true;
    let matchFlagYear=true;

    var current_book=filejson[i];
    if(search.category!="")
    {
      console.log("there is category");
      if(current_book.book_category==search.category)
      {
        matchFlagCategory=true;

      }
      else {
        matchFlagCategory=false;

      }
    }

    if(search.author!="")
    {
      console.log("there is author");

      if(current_book.book_author==search.author)
      {
        matchFlagAuthor=true;
      }
      else {
        matchFlagAuthor=false;
      }
    }

    if(search.edition!="")
    {
      console.log("there is edition");

      if(current_book.book_edition==search.edition)
      {
        matchFlagEdition=true;
      }
      else {
        matchFlagEdition=false;
      }
    }
    if(search.year1!="")
    {
      console.log("there is year");

      if(search.year_option=="Exact")
      {
        console.log("there is exact");

        if(current_book.book_parution.split('-')[0]==search.year1)
        {
          matchFlagYear=true;
        }
        else {
          matchFlagYear=false;
        }

      }
      else if(search.year_option=="Before")
      {
        console.log("there is before");

        if( parseInt(current_book.book_parution.split('-')[0],10)<parseInt(search.year1,10))
        {
          matchFlagYear=true;
        }
        else {
          matchFlagYear=false;
        }

      }
      else if(search.year_option=="After")
      {
        console.log("there is after");

        if( parseInt(current_book.book_parution.split('-')[0],10)>parseInt(search.year1,10))
        {
          matchFlagYear=true;
        }
        else {
          matchFlagYear=false;
        }
      }

      else if(search.year_option=="Between")
      {
        console.log("there is between");

        if(parseInt(current_book.book_parution.split('-')[0],10)>=parseInt(search.year1,10) && parseInt(current_book.book_parution.split('-')[0],10)<=parseInt(search.year2,10))
        {
          matchFlagYear=true;
        }
        else {
          matchFlagYear=false;
        }
      }



    }




if(matchFlagCategory==true&&matchFlagAuthor==true&&matchFlagEdition==true&&matchFlagYear==true)
{
  listbookssearched.push(current_book);

}
  }
  console.log(listbookssearched);
  return listbookssearched;
};


  exports.data = methodes;
