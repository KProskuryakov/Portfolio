let express = require('express');
let router = express.Router();

let bcrypt = require('bcrypt');
const users = require('../db').users;

const co = require('co');

router.get('/', function(req, res) {
    res.render('register', {title: "Register"});
});

router.post('/', co.wrap(function* (req, res, next) {

    // Get our form values. These rely on the "name" attributes
    let username = req.body.username;
    let userPassword = req.body.password;

    let user = yield users.findByUsername(username);

    if (user) {
        res.redirect('/register');
    } else {
        let hash = yield bcrypt.hash(userPassword, 10);
        yield users.insert(username, hash);
        let user = yield users.findByUsername(username);
        req.login(user, function(err) {
            if (err) {
                return next(err);
            }
            return res.redirect('/');
        });
    }


    // bcrypt.hash(userPassword, null, null, function(err, hash) {
    //     // Submit to the DB
    //     userCollection.insert({
    //         "username" : username,
    //         "password": hash
    //     }, function (err, doc) {
    //         if (err) {
    //             // If it failed, return error
    //             res.send("There was a problem adding the information to the database.");
    //         }
    //         else {
    //             // And forward to success page
    //             res.redirect("/");
    //         }
    //     });
    // });
}));

module.exports = router;