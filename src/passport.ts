import bcrypt = require("bcrypt");
import session = require("express-session");
import winston = require("winston");

import passport = require("passport");
import local = require("passport-local");
const LocalStrategy = local.Strategy;

import SiteUser from "./db/models/site-user";
import * as db_su from "./db/site-user-table";

passport.use(new LocalStrategy({ usernameField: "email" },
  function strategy(email: string, password: string, done: any) {
  email = email.toLocaleLowerCase();
  winston.info("Strategy activated with email: " + email);
  db_su.getSiteUserByEmail(email).then((siteUser) => {
    if (!siteUser) {
      winston.info("Existing user not found for email: " + email);
      return done(null, false, { message: "Incorrect username." });
    }
    winston.info("Existing user found for email: " + email);
    bcrypt.compare(password, siteUser.password).then((result) => {
      if (result === false) {
        winston.info("Incorrect password for email: " + email);
        return done(null, false, { message: "Incorrect password." });
      }
      winston.info("Password accepted for email: " + email);
      return done(null, siteUser);
    });
  })
  .catch((err) => {
    return done(err);
  });
}));

passport.serializeUser((user: SiteUser, done: (err: any, email: string) => void) => {
  done(null, user.email);
});

passport.deserializeUser(async (email: string, done: (err: Error | null, user: SiteUser | null) => void) => {
  db_su.getSiteUserByEmail(email).then((user) => {
    done(null, user);
  }).catch((err) => {
    done(err, null);
  });
});

export = passport;
