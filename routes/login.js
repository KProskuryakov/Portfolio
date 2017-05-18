"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var router = express.Router();
var passport = require('../passport');
router.get('/', function (req, res) {
    res.render('login', { title: "Login" });
});
router.post('/', passport.authenticate('local', { successRedirect: "/", failureRedirect: "/login" }));
module.exports = router;
