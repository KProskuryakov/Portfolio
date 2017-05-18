"use strict";
var bcrypt = require("bcrypt");
var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
var postgresdb_1 = require("./postgresdb");
passport.use(new LocalStrategy({ usernameField: 'email' }, function strategy(email, password, done) {
    console.log('Strategy activated with email: ' + email);
    postgresdb_1.siteUsers.getUserByEmail(email, function onPasswordGet(err, user) {
        if (err)
            return done(err);
        if (!user) {
            console.log('Existing user not found for email: ' + email);
            return done(null, false, { message: 'Incorrect username.' });
        }
        console.log('Existing user found for email: ' + email);
        bcrypt.compare(password, user.password, function onBcryptHashCompare(err, result) {
            if (err)
                return done(err);
            if (result === false) {
                console.log('Incorrect password for email: ' + email);
                return done(null, false, { message: 'Incorrect password.' });
            }
            console.log('Password accepted for email: ' + email);
            return done(null, user);
        });
    });
}));
passport.serializeUser(function (user, done) {
    done(null, user.email);
});
passport.deserializeUser(function (email, done) {
    postgresdb_1.siteUsers.getUserByEmail(email, function onGetUser(err, user) {
        return done(err, user);
    });
});
module.exports = passport;
