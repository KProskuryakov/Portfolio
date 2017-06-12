/**
 * Created by kosty on 3/13/2017.
 */
import bcrypt = require('bcrypt')
import session = require('express-session')

import passport = require('passport')
let LocalStrategy = require('passport-local').Strategy

import SiteUser from './db/models/SiteUser'
import * as db_su from './db/SiteUserTable'

passport.use(new LocalStrategy({ usernameField: 'email' }, function strategy(email: string, password: string, done: any) {
  email = email.toLocaleLowerCase()
  console.log('Strategy activated with email: ' + email)
  db_su.getSiteUserByEmail(email).then((siteUser) => {
    if (!siteUser) {
      console.log('Existing user not found for email: ' + email)
      return done(null, false, { message: 'Incorrect username.' })
    }
    console.log('Existing user found for email: ' + email)
    bcrypt.compare(password, siteUser.password).then((result) => {
      if (result === false) {
        console.log('Incorrect password for email: ' + email)
        return done(null, false, { message: 'Incorrect password.' })
      }
      console.log('Password accepted for email: ' + email)
      return done(null, siteUser)
    })
  })
  .catch((err) => {
    return done(err)
  })
}))

passport.serializeUser(function (user: SiteUser, done: (err: Error, email: string) => void) {
  done(null, user.email)
})

passport.deserializeUser(async function (email: string, done: (err: Error | null, user: SiteUser | null) => void) {
  db_su.getSiteUserByEmail(email).then((user) => {
    done(null, user)
  }).catch((err) => {
    done(err, null)
  })
})

export = passport