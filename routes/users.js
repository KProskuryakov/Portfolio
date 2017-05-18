"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var router = express.Router();
var siteUsers = require('../postgresdb').siteUsers;
router.get('/', function (req, res, next) {
    siteUsers.getAll(function onGetAll(err, userArray) {
        if (err)
            next(err);
        res.render('users', { title: "All Users", userArray: userArray });
    });
});
module.exports = router;
