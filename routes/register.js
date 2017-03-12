let express = require('express');
let router = express.Router();

let bcrypt = require('bcrypt-nodejs');

router.get('/', function(req, res) {
    res.render('register', {title: "Register"});
});

router.post('/', function(req, res) {

    // Set our internal DB
    let db = req.db;

    // Get our form values. These rely on the "name" attributes
    let userName = req.body.username;
    let userPassword = req.body.password;

    // Set our collection
    let collection = db.get('usercollection');

    bcrypt.hash(userPassword, null, null, function(err, hash) {
        // Submit to the DB
        collection.insert({
            "username" : userName,
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