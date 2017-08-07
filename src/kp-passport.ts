import bcrypt = require("bcrypt");
import session = require("express-session");
import winston = require("winston");

import passport = require("passport");
import local = require("passport-local");
const LocalStrategy = local.Strategy;

import SiteUser from "./db/models/SiteUser";
import * as siteUserTable from "./db/SiteUserTable";

passport.use(new LocalStrategy({ usernameField: "email" },
  function strategy(email: string, password: string, done: any) {
  email = email.toLocaleLowerCase();
  winston.info(`Strategy activated with email: ${email}`);
  siteUserTable.getSiteUserByEmail(email).then((siteUser) => {
    if (!siteUser) {
      winston.info(`Existing user not found for email: ${email}`);
      return done(null, false, { message: "Incorrect username." });
    }
    winston.info(`Existing user found for email: ${email}`);
    bcrypt.compare(password, siteUser.password).then((result) => {
      if (result === false) {
        winston.info(`Incorrect password for email: ${email}`);
        return done(null, false, { message: "Incorrect password." });
      }
      winston.info(`Password accepted for email: ${email}`);
      return done(null, siteUser);
    });
  })
  .catch((err) => {
    winston.error(`Error processing user with email: ${email}`);
    return done(err);
  });
}));

passport.serializeUser((user: SiteUser, done: (err: any, email: string) => void) => {
  winston.info(`User serialized with email: ${user.email}`);
  done(null, user.email);
});

passport.deserializeUser(async (email: string, done: (err: Error | null, user: SiteUser | null) => void) => {
  siteUserTable.getSiteUserByEmail(email).then((user) => {
    winston.info(`User deserialized with email: ${email}`);
    done(null, user);
  }).catch((err) => {
    winston.error(`User failed to deserialize with email: ${email}`);
    done(err, null);
  });
});

export = passport;
