const express = require('express');
const {v4: uuid} = require('uuid');
const app = express();

const data = require('./books.json');

app.use(express.json());

app.get('/books', function (req, res) {
  readBooks(req, res);
});

function readBooks(req, res) {
  // res.setHeader("Content-Type", "application/json");
  res.json(data);
}

app.post('/books', function (req, res) {
  createBook(req, res);
});

function isInvalid(req) {
  const {title, author} = req.body;
  if (
    typeof req.body === 'undefined' ||
    typeof title === 'undefined' ||
    typeof author === 'undefined'
  ) {
    return true;
  } else {
    return false;
  }
}

const isExist = title =>
  data.find(book => book.title === title && book.author === author);

function createBook(req, res) {
  const {title, author} = req.body;
  if (isInvalid(req)) {
    res.status(400).send('invalid request');
    return;
  }
  const id = uuid();
  const newBook = {
    id,
    title,
    author,
  };

  if (isExist(title)) res.status(400).send('the book is already exist');
  else data.push(newBook);
  res.status(201).json(newBook);
}

app.put('/books/:id', function (req, res) {
  updateBook(req, res);
});

function updateBook(req, res) {
  const {title, author} = req.body;
  if (isInvalid(req)) {
    res.status(400).send('invalid request');
    return;
  }

  const id = req.params.id;
  //  const ind = data.indexOf(isExist(title));
  const bookToUpdate = data.find(book => book.id === id);
  if (!bookToUpdate) {
    res.status(404).send('book can not found');
    return;
  }
  bookToUpdate.title = title;
  bookToUpdate.author = author;
  res.send(data);
}

app.delete('/books/:id', function (req, res) {
  deleteBook(req, res);
});

function deleteBook(req, res) {
  const id = req.params.id;
  const bookToDelete = data.find(book => book.id === id);
  if (!bookToDelete) {
    res.status(404).send('book can not found');
    return;
  }
  data.splice(data.indexOf(bookToDelete), 1);
  res.send('ok');
}

app.listen(3000);
