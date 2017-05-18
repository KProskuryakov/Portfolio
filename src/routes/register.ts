import express = require('express');
let router = express.Router();

import bcrypt = require('bcrypt');

import { siteUsers } from '../postgresdb';


router.get('/', function(req, res) {
    res.render('register', {title: "Register"});
});

router.post('/', function postRegister (req, res, next) {
    // Get our form values. These rely on the "name" attributes in the html tags
    let email = req.body.email;
    let password = req.body.password;
    let displayName = req.body.display_name;

    console.log('User registering with data: ' + email + " " + displayName);

    siteUsers.getUserByEmail(email, function onUserCheck(err, user) {
        if (err) return next(err);
        if (user) {
            console.log('There was a user found with email: ' + email);
            return res.redirect('/register');
        }
        bcrypt.hash(password, 10, function onPasswordHash(err, passwordHash) {
            if (err) return next(err);
            console.log('Password hash successful for user with email: ' + email);
            siteUsers.insert(email, displayName, passwordHash, function onInsert(err, user) {
                if (err) return next(err);
                console.log('User inserted into db with email: ' + email);
                req.login(user, function onLogin(err) {
                    if (err) return next(err);
                    console.log('User logged in with email: ' + email);
                    return res.redirect('/');
                });
            });
        });
    });
});

module.exports = router;