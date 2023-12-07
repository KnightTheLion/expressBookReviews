const express = require('express');
const books = require('./booksdb.js');
const { isValid, users } = require('./auth_users.js');
const public_users = express.Router();

public_users.post('/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const registerUser = new Promise((resolve, reject) => {
    if (username && password) {
      if (!isValid(username)) {
        users.push({ username: username, password: password });
        resolve('User successfully registered. Now you can login');
      } else {
        reject('User already exists!');
      }
    } else {
      reject('Unable to register user.');
    }
  });

  registerUser
    .then((message) => {
      res.status(200).json({ message });
    })
    .catch((error) => {
      res.status(404).json({ message: error });
    });
});

const getBookList = () => {
  return new Promise((resolve) => {
    resolve(JSON.stringify(books, null, 10));
  });
};

public_users.get('/', function (req, res) {
  getBookList()
    .then((bookList) => {
      res.send(bookList);
    });
});

const getBookByISBN = (isbn) => {
  return new Promise((resolve) => {
    resolve(JSON.stringify(books[isbn], null, 10));
  });
};

public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  getBookByISBN(isbn)
    .then((bookDetails) => {
      res.send(bookDetails);
    });
});

const getBookByAuthor = (author) => {
  return new Promise((resolve, reject) => {
    for (let key in books) {
      if (books[key].author === author) {
        resolve(JSON.stringify(books[key], null, 4));
      }
    }
    reject('Author not found');
  });
};

public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  getBookByAuthor(author)
    .then((bookDetails) => {
      res.send(bookDetails);
    })
    .catch((error) => {
      res.status(404).send(error);
    });
});

const getBookByTitle = (title) => {
  return new Promise((resolve, reject) => {
    for (let key in books) {
      if (books[key].title === title) {
        resolve(JSON.stringify(books[key], null, 4));
      }
    }
    reject('Title not found');
  });
};

public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  getBookByTitle(title)
    .then((bookDetails) => {
      res.send(bookDetails);
    })
    .catch((error) => {
      res.status(404).send(error);
    });
});

const getBookReview = (isbn) => {
  return new Promise((resolve) => {
    resolve(JSON.stringify(books[isbn].reviews));
  });
};

public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  getBookReview(isbn)
    .then((reviews) => {
      res.send(reviews);
    });
});

module.exports.general = public_users;
