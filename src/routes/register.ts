import express = require("express");
const router = express.Router();

import addresses = require("email-addresses");
import winston = require("winston");

import bcrypt = require("bcrypt");
import * as db_su from "../db/site-user-table";

router.get("/", (req, res) => {
  const err = req.query.err;
  res.render("register", { page: "Register", err });
});

/**
 * Register error strings:
 * INVALID_EMAIL
 * INVALID_PASSWORD
 * INVALID_DISPLAY_NAME
 * DUPLICATE_EMAIL
 * DUPLICATE_DISPLAY_NAME
 */
router.post("/", async (req, res, next) => {
  // Get our form values. These rely on the "name" attributes in the html tags
  const email = (req.body.email as string).toLocaleLowerCase();
  if (!addresses.parseOneAddress(email) || email.length > 256) {
    return res.redirect("/register?err=INVALID_EMAIL");
  }
  const password = (req.body.password as string);
  if (password.length < 6 || password.length > 256) {
    return res.redirect("/register?err=INVALID_PASSWORD");
  }
  const displayName = (req.body.display_name as string);
  if (displayName.length > 64) {
    return res.redirect("/register?err=INVALID_DISPLAY_NAME");
  }

  winston.info("User registering with data: " + email + " " + displayName);
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    winston.info("Password hash successful for user with email: " + email);
    const user = await db_su.insertSiteUser(email, displayName, passwordHash);
    winston.info("User inserted into db with email: " + email);
    req.login(user, (err) => {
      if (err) { throw err; }
      winston.info("User logged in with email: " + email);
      return res.redirect("/");
    });
  } catch (err) {
    if (err.message === 'duplicate key value violates unique constraint "site_users_pkey"') {
      return res.redirect("/register?err=DUPLICATE_EMAIL");
    } else if (err.message === 'duplicate key value violates unique constraint "site_users_display_name_key"') {
      return res.redirect("/register?err=DUPLICATE_DISPLAY_NAME");
    }
    return next(err);
  }
});

module.exports = router;
