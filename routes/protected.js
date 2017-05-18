"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var router = express.Router();
var passport = require('../passport');
router.get('/', function (req, res) {
    if (req.user) {
        res.send('woo!');
    }
    else {
        res.status(401).send('Not logged in!');
    }
});
module.exports = router;
