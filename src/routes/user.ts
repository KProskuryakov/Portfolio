import express = require('express');
let router = express.Router();
// let users = require('../db').siteUsers;

import { siteUsers, lasergameLevels } from '../postgresdb';

router.get('/:user', function (req, res, next) {
    siteUsers.getUserByDisplayName(req.params.user, function onGetUser(err: Error, pageOwner) {
        if (err) return next(err);
        if (!pageOwner) next();
        lasergameLevels.getAllLevelsOfPlayer(pageOwner.display_name, function onGetAllLevelsOfPlayer(err: Error, levelArray) {
            if (err) return next(err);
            res.render('user', {title: pageOwner.display_name, pageOwner: pageOwner, levelArray: levelArray});
        });
    });
});

module.exports = router;