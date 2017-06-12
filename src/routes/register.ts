import express = require('express');
let router = express.Router();

let addresses = require('email-addresses');

import bcrypt = require('bcrypt');
import * as db_su from '../db/SiteUserTable';

router.get('/', function (req, res) {
  let err = req.query.err;
  res.render('register', { page: "Register", err: err });
});

/**
 * Register error strings:
 * INVALID_EMAIL
 * INVALID_PASSWORD
 * INVALID_DISPLAY_NAME
 * DUPLICATE_EMAIL
 * DUPLICATE_DISPLAY_NAME
 */
router.post('/', async function postRegister(req, res, next) {
  // Get our form values. These rely on the "name" attributes in the html tags
  let email = (<string>req.body.email).toLocaleLowerCase()
  if (!addresses.parseOneAddress(email) || email.length > 256) {
    return res.redirect('/register?err=INVALID_EMAIL')
  }
  let password = (<string>req.body.password)
  if (password.length < 6 || password.length > 256) {
    return res.redirect('/register?err=INVALID_PASSWORD')
  }
  let displayName = (<string>req.body.display_name)
  if (displayName.length > 64) {
    return res.redirect('/register?err=INVALID_DISPLAY_NAME')
  }

  console.log('User registering with data: ' + email + " " + displayName)
  try {
    let passwordHash = await bcrypt.hash(password, 10)
    console.log('Password hash successful for user with email: ' + email)
    let user = await db_su.insertSiteUser(email, displayName, passwordHash)
    console.log('User inserted into db with email: ' + email)
    req.login(user, (err) => {
      if (err) throw err
      console.log('User logged in with email: ' + email)
      return res.redirect('/')
    })
  } catch (err) {
    if (err.message === 'duplicate key value violates unique constraint "site_users_pkey"') {
      return res.redirect('/register?err=DUPLICATE_EMAIL');
    } else if (err.message === 'duplicate key value violates unique constraint "site_users_display_name_key"') {
      return res.redirect('/register?err=DUPLICATE_DISPLAY_NAME');
    }
    return next(err)
  }
});

module.exports = router;