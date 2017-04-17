let express = require('express');
let router = express.Router();

// const users = require('../db').siteUsers;
// const pool = require('../postgresdb');

const siteUsers = require('../postgresdb').siteUsers;

router.get('/', function (req, res, next) {
    siteUsers.getAll(function onGetAll (err, userArray) {
        if (err) next(err);
        res.render('users', {title: "All Users", userArray: userArray});
    });
});

module.exports = router;