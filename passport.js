/**
 * Created by kosty on 3/13/2017.
 */
let bcrypt = require('bcrypt');
let session = require('express-session');

let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;

let siteUsers = require('./postgresdb').siteUsers;

passport.use(new LocalStrategy({usernameField: 'email'}, function strategy (email, password, done) {
    console.log('Strategy activated with email: ' + email);
    siteUsers.getUserByEmail(email, function onPasswordGet(err, user) {
        if (err) return done(err);
        if (!user) {
            console.log('Existing user not found for email: ' + email);
            return done(null, false, {message: 'Incorrect username.'});
        }
        console.log('Existing user found for email: ' + email);
        bcrypt.compare(password, user.password, function onBcryptHashCompare(err, result) {
            if (err) return done(err);
            if (result === false) {
                console.log('Incorrect password for email: ' + email);
                return done(null, false, {message: 'Incorrect password.'});
            }
            console.log('Password accepted for email: ' + email);
            return done(null, user);
        });
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user.email);
});

passport.deserializeUser(function (email, done) {
    siteUsers.getUserByEmail(email, function onGetUser (err, user) {
        return done(err, user);
    });
});
module.exports = passport;