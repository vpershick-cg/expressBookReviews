const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username) {
        return res.status(404).json({message: "Error, no username provided."});
    }
    if(!password){
        return res.status(404).json({message: "Error, no password provided."});
    }
    if(users.length > 0){
        let username_matches = users.filter((user) => user.username === username);
        if(username_matches.length > 0) {
            return res.json({message: "Error, username already exists"});
        }
    }
    //If we made it this far, user is assumed to be valid. Create key value pair, push onto users object 
    users.push({"username":username, "password":password});
    return res.status(200).send("User successfully registered");
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    const get_books = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify({books}, null, 4)));
      });

      get_books.then(() => console.log("Promise for Task 10 resolved"));
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const get_books = new Promise((resolve, reject) => {
        let books_by_isbn = [];
        Object.keys(books).forEach(function(key) {
            var val = books[key];
            if(val.isbn === isbn) {
                books_by_isbn.push(`${JSON.stringify(books[key])}`);
            }
        });
        resolve(res.send(JSON.stringify({books_by_isbn}, null, 4)));
      });

      get_books.then(() => console.log("Promise for Task 11 resolved"));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const get_books = new Promise((resolve, reject) => {
        let books_by_author = [];
        Object.keys(books).forEach(function(key) {
            var val = books[key];
            if(val.author === author) {
                books_by_author.push(`${JSON.stringify(books[key])}`);
            }
        });
        resolve(res.send(JSON.stringify({books_by_author}, null, 4)));
      });

      get_books.then(() => console.log("Promise for Task 12 resolved"));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const get_books = new Promise((resolve, reject) => {
        let books_by_title = [];
        Object.keys(books).forEach(function(key) {
            var val = books[key];
            if(val.title === title) {
                books_by_title.push(`${JSON.stringify(books[key])}`);
            }
        });
        resolve(res.send(JSON.stringify({books_by_title}, null, 4)));
      });

      get_books.then(() => console.log("Promise for Task 13 resolved"));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let book_results_key = "None found";
    let book_results_review = [];
    Object.keys(books).forEach(function(key) {
        //iterate, then upon finding the match, push it onto book_results
        var val = books[key];
        if(val.isbn === isbn) {
            book_results_key = `Index ${key}:`;
            book_results_review.push(`${book_results_key} ${JSON.stringify(books[key].reviews)}\n`);
        }
      });
    res.send(`Reviews for ISBN ${isbn}: \n ---- \n ${book_results_review} \n`);

});

module.exports.general = public_users;
