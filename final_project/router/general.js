const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    // return res.status(300).json({message: "Yet to be implemented"});
    const username = req.body.username;
    const password = req.body.password;

    if (!username) {
        return res.status(404).json({message: "Body Empty or Invalid, no username provided."});
    }
    else if(!password){
        return res.status(404).json({message: "Body Empty or Invalid, no password provided."});
    }
    else if (users.filter(user.username === username)) {
        return res.json({message: "Username already exists"});
    }
    
    // let accessToken = jwt.sign({
    //     data: user
    //   }, 'access', { expiresIn: 60 * 60 });
    //   req.session.authorization = {
    //     accessToken
    // }
    return res.status(200).send("User successfully registered");
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.status(300).json({message: JSON.stringify(books)});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let filtered_books_by_isbn = [];
//   books.foreach(async function(book) {
//     filtered_books_by_isbn.push(book);
//   });
    res.send(filtered_books_by_isbn);
//   let result = books.filter((book) => book.isbn === isbn);
//   return res.status(300).json({message: result});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let filtered_books_by_author = [];
//   for (const book of books) {
    
//     let key = book.key;
//     if(book[key].author === author) {
//       filtered_books_by_author.push(book);
//     }
//   }

// for(let i=1; i<=books.length; i++){
//     filtered_books_by_author.push(`${books[i]}`);
// }

  //   return res.status(300).json({message: result});
    res.send(filtered_books_by_author);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let filtered_books_by_title = [];
    res.send(filtered_books_by_title);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
