const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
    if(users.length > 0){
        let username_matches = users.filter((user) => user.username === username);
        if(username_matches.length > 0) {
            let user_password = username_matches[0].password;
            if(user_password === password) {
                return true; 
            } else console.log("Incorrect password");
        } else console.log("User not found");
    }
    return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username) {
        return res.status(404).json({message: "Error, no username provided."});
    }
    if(!password){
        return res.status(404).json({message: "Error, no password provided."});
    }
    if(authenticatedUser(username,password)){
        let accessToken = jwt.sign({
            data: username
        }, 'access', { expiresIn: 60 * 60 });
        req.session.authorization = {
            accessToken
        }
        return res.json({message: "Login successful"});
    }
    return res.json({message: "Login not successful"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

    const username = req.user.data;
    const isbn = req.params.isbn;
    const review_content = req.body.review;
    
    //find the book by ISBN
    Object.keys(books).forEach(function(key) {
        var val = books[key];
        if(val.isbn === isbn) {
            //if review is being added to same ISBN by same user, modify existing review
            //  remove the old review and then push on the new review 
            let existing_review = books[key].reviews.filter((review) => review.username === username);
            if(existing_review.length > 0) {
                console.log("Found existing review by this username");
                books[key].reviews = books[key].reviews.filter((review) => review.username !== username);
                books[key].reviews.push({"username":username, "review":review_content});
            }
            //otherwise, find book by the ISBN and add the review on
            else {
                books[key].reviews.push({"username":username, "review":review_content});
            }
            return res.json(books[key].reviews);
        }
    });
    return res.status(300).json({message: "Error, could not update reviews"});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    //user can only delete reviews created by user, and not those of other users 
    //assuming one review per user, identified by the username
    const username = req.user.data;
    const isbn = req.params.isbn;
     
    //find the book by ISBN
    Object.keys(books).forEach(function(key) {
        var val = books[key];
        if(val.isbn === isbn) {
            let num_reviews = books[key].reviews.length;
            //search the reviews for one belonging to the user, if found then delete it 
            books[key].reviews = books[key].reviews.filter((review) => review.username !== username);
            //if review was successfully removed
            if(books[key].reviews.length < num_reviews) {
                return res.status(300).json({message: `Deleted review by ${username}`});
            }
        }
    });
    return res.status(300).json({message: "Error, could not delete review"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
