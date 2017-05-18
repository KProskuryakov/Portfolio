import express = require('express');
let router = express.Router();

let passport = require('../passport');

router.get('/', function (req, res) {
    res.render('login', {title: "Login"});
});

router.post('/', passport.authenticate('local', {successRedirect: "/", failureRedirect: "/login"}));

module.exports = router;