/**
 * Created by kosty on 3/13/2017.
 */
import bcrypt = require('bcrypt');
import session = require('express-session');

import passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;

import { siteUsers } from './postgresdb';
import { SiteUser } from './dbmodels';

passport.use(new LocalStrategy({usernameField: 'email'}, function strategy (email: string, password: string, done: any) {
    console.log('Strategy activated with email: ' + email);
    siteUsers.getUserByEmail(email, function onPasswordGet(err: Error, user: SiteUser) {
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

passport.serializeUser(function(user: SiteUser, done: (err: Error, email: string) => void) {
    done(null, user.email);
});

passport.deserializeUser(function (email: string, done: (err: Error, user: SiteUser) => void) {
    siteUsers.getUserByEmail(email, function onGetUser (err: Error, user: SiteUser) {
        return done(err, user);
    });
});

export = passport;