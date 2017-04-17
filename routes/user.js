let express = require('express');
let router = express.Router();
// let users = require('../db').siteUsers;

const siteUsers = require('../postgresdb').siteUsers;
const lasergameLevels = require('../postgresdb').lasergameLevels;

router.get('/:user', function (req, res, next) {
    siteUsers.getUserByDisplayName(req.params.user, function onGetUser(err, pageOwner) {
        if (err) return next(err);
        if (!pageOwner) next();
        lasergameLevels.getAllLevelsOfPlayer(pageOwner.display_name, function onGetAllLevelsOfPlayer(err, levelArray) {
            if (err) return next(err);
            res.render('user', {title: pageOwner.display_name, pageOwner: pageOwner, levelArray: levelArray});
        });
    });
});

module.exports = router;