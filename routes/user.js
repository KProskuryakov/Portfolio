"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var router = express.Router();
var postgresdb_1 = require("../postgresdb");
router.get('/:user', function (req, res, next) {
    postgresdb_1.siteUsers.getUserByDisplayName(req.params.user, function onGetUser(err, pageOwner) {
        if (err)
            return next(err);
        if (!pageOwner)
            next();
        postgresdb_1.lasergameLevels.getAllLevelsOfPlayer(pageOwner.display_name, function onGetAllLevelsOfPlayer(err, levelArray) {
            if (err)
                return next(err);
            res.render('user', { title: pageOwner.display_name, pageOwner: pageOwner, levelArray: levelArray });
        });
    });
});
module.exports = router;
