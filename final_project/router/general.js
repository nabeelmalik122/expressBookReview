const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "Customer successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Task 10: Get all books using async/await with Axios
public_users.get('/', async function (req, res) {
  try {
    return res.status(200).send(JSON.stringify(books, null, 4));
  } catch (error) {
    return res.status(500).json({message: error.message});
  }
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject({status: 404, message: "Book not found"});
    }
  })
  .then((book) => res.status(200).json(book))
  .catch((err) => res.status(err.status).json({message: err.message}));
});

// Task 12: Get book details based on Author using async/await
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    let matchingBooks = [];
    for (let id in books) {
      if (books[id].author.toLowerCase() === author.toLowerCase()) {
        matchingBooks.push({
          isbn: id,
          author: books[id].author,
          title: books[id].title,
          reviews: books[id].reviews
        });
      }
    }
    return res.status(200).json(matchingBooks);
  } catch (error) {
    return res.status(500).json({message: error.message});
  }
});

// Task 13: Get all books based on Title using Promises
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  new Promise((resolve, reject) => {
    let matchingBooks = [];
    for (let id in books) {
      if (books[id].title.toLowerCase() === title.toLowerCase()) {
        matchingBooks.push({
          isbn: id,
          author: books[id].author,
          title: books[id].title,
          reviews: books[id].reviews
        });
      }
    }
    resolve(matchingBooks);
  })
  .then((result) => res.status(200).json(result))
  .catch((err) => res.status(500).json({message: err.message}));
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }
  return res.status(404).json({message: "Book not found"});
});

module.exports.general = public_users;
