import express = require('express')
let router = express.Router()

let passport = require('../passport')

router.get('/', function (req, res) {
  let err = req.query.err
  res.render('login', {page: "Login", err: err})
})

router.post('/', passport.authenticate('local', {successRedirect: "/", failureRedirect: "/login?err=INVALID"}))

module.exports = router