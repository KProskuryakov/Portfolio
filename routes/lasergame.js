"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var router = express.Router();
router.get('/', function (req, res) {
    if (req.query.id) {
        res.render('lasergame', { title: "Laser Game", levelID: req.query.id });
    }
    else {
        res.render('lasergame', { title: "Laser Game" });
    }
});
module.exports = router;
