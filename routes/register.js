"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var router = express.Router();
var bcrypt = require("bcrypt");
var postgresdb_1 = require("../postgresdb");
router.get('/', function (req, res) {
    res.render('register', { title: "Register" });
});
router.post('/', function postRegister(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    var displayName = req.body.display_name;
    console.log('User registering with data: ' + email + " " + displayName);
    postgresdb_1.siteUsers.getUserByEmail(email, function onUserCheck(err, user) {
        if (err)
            return next(err);
        if (user) {
            console.log('There was a user found with email: ' + email);
            return res.redirect('/register');
        }
        bcrypt.hash(password, 10, function onPasswordHash(err, passwordHash) {
            if (err)
                return next(err);
            console.log('Password hash successful for user with email: ' + email);
            postgresdb_1.siteUsers.insert(email, displayName, passwordHash, function onInsert(err, user) {
                if (err)
                    return next(err);
                console.log('User inserted into db with email: ' + email);
                req.login(user, function onLogin(err) {
                    if (err)
                        return next(err);
                    console.log('User logged in with email: ' + email);
                    return res.redirect('/');
                });
            });
        });
    });
});
module.exports = router;
