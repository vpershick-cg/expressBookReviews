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
    return res.status(300).json({message: JSON.stringify(books)});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let book_results_key = "None found";
    let book_results_val = [];
    Object.keys(books).forEach(function(key) {
        //iterate, then upon finding the match, push it onto book_results
        var val = books[key];
        if(val.isbn === isbn) {
            book_results_key = `Index ${key}:`;
            book_results_val.push(`${book_results_key} ${JSON.stringify(books[key])}\n`);
        }
      });
    res.send(`Result for ISBN ${isbn}: \n----\n ${book_results_val}`);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let book_results_key = "None found";
    let book_results_val = [];
    Object.keys(books).forEach(function(key) {
        var val = books[key];
        if(val.author === author) {
            book_results_key =  `Index ${key}:`;
            book_results_val.push(`${book_results_key} ${JSON.stringify(books[key])}\n`);
        }
      });
    res.send(`Result for author ${author}: \n ----\n ${book_results_val}`);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let book_results_key = "None found";
    let book_results_val = [];
    Object.keys(books).forEach(function(key) {
        var val = books[key];
        if(val.title === title) {
            book_results_key = `Index ${key}:`;
            book_results_val.push(`${book_results_key} ${JSON.stringify(books[key])}\n`);
        }
      });
    res.send(`Result for title ${title}: \n ----\n ${book_results_val} \n`);
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
