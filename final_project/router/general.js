const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios")


public_users.post("/register", (req,res) => {

    users.push({"firstName":req.query.firstName,"lastName":req.query.lastName,"email":req.query.email,"DOB":req.query.DOB});
    res.send("The user" + (' ')+ (req.query.firstName) + " Has been added!")



});

// Get the book list available in the shop

//public_users.get('/',function (req, res) {

//  res.send(JSON.stringify(books));

//}); 
public_users.get('/', (req, res) => {
  const booksPromise = new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject('Kitaplar bulunamadı.');
    }
  });

  booksPromise
    .then((data) => {
      res.send(JSON.stringify(data));
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Get book details based on ISBN
//public_users.get('/isbn/:isbn',function (req, res) {

//    const isbn = req.params.isbn;

 //   res.send(books[isbn]);
 //});

 public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  const bookPromise = new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject('Couldnt find book');
    }
  });

  bookPromise
    .then((book) => {
      res.send(JSON.stringify(book));
    })
    .catch((error) => {
      res.status(404).send(error);
    });
});
  
// Get book details based on author


public_users.get('/author/:author', (req, res) => {

  const author = req.params.author;
  const bookKeys = Object.keys(books);
  const matchingBooks = [];

  const bookPromise = new Promise((resolve, reject) => {
    for (let i = 0; i < bookKeys.length; i++) {
      const bookKey = bookKeys[i];
      const book = books[bookKey];

      if (book.author === author) {
        matchingBooks.push(book);
      }
    }

    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject('Yazar bulunamadı.');
    }
  });

  bookPromise
    .then((books) => {
      res.send(JSON.stringify(books));
    })
    .catch((error) => {
      res.status(404).send(error);
    });

  

  
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {

  const title = req.params.title.replace(/_/g, ' ');;

  let bookKeys = Object.keys(books);

  for (let i = 0; i < bookKeys.length; i++) {
      const bookKey = bookKeys[i];
      const book = books[bookKey]; 
    
      if (book.title=== title) {
        res.send(book);
      }
  }



});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {

    const isbn = req.params.isbn;

    res.send(books[isbn].reviews);

});

module.exports.general = public_users;

