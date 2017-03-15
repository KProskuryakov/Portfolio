/**
 * Created by kosty on 3/13/2017.
 */
let bcrypt = require('bcrypt');
let session = require('express-session');

let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;

let co = require('co');

let users = require('./db').users;

passport.use(new LocalStrategy(co.wrap(function* (username, password, done) {
    try {
        let user = yield users.getUserPassword(username);
        if (!user) {
            return done(null, false, {message: 'Incorrect username.'});
        }
        let correct = yield bcrypt.compare(password, user.password);
        if (!correct) {
            return done(null, false, {message: 'Incorrect password.'});
        }
        return done(null, user);
    } catch (err) {
        console.log(err);
    }
})));

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(co.wrap(function* (id, done) {
    try {
        let user = yield users.findById(id);
        done(null, user);
    } catch (err) {
        console.log(err);
    }
}));

module.exports = passport;