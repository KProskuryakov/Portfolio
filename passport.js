/**
 * Created by kosty on 3/13/2017.
 */
let bcrypt = require('bcrypt-nodejs');
let session = require('express-session');

let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;

let userCollection = require('./db').userCollection;

passport.use(new LocalStrategy(
    function(username, password, done) {
        userCollection.findOne({ username: username }, function(err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            bcrypt.compare(password, user.password, function(err, res) {
                if (!res) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, user);
            });
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    userCollection.findOne({_id: id}, '-password', function(err, user) {
        done(err, user);
    });
});

module.exports = passport;