let express = require('express');
let router = express.Router();

let bcrypt = require('bcrypt-nodejs');
let userCollection = require('../db').userCollection;

router.get('/', function(req, res) {
    res.render('register', {title: "Register"});
});

router.post('/', function(req, res) {

    // Get our form values. These rely on the "name" attributes
    let username = req.body.username;
    let userPassword = req.body.password;


    bcrypt.hash(userPassword, null, null, function(err, hash) {
        // Submit to the DB
        userCollection.insert({
            "username" : username,
            "password": hash
        }, function (err, doc) {
            if (err) {
                // If it failed, return error
                res.send("There was a problem adding the information to the database.");
            }
            else {
                // And forward to success page
                res.redirect("/");
            }
        });
    });
});

module.exports = router;