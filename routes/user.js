let express = require('express');
let router = express.Router();
let users = require('../db').users;

const co = require('co');

router.get('/:user', function (req, res, next) {
    if (req.user && req.params.user === req.user.username) {
        res.render('user', {title: req.user.username, userpage: req.user});
    } else {
        co(function* () {
            let user = yield users.findByUsername(req.params.user);
            if (user) {
                res.render('user', {title: user.username, userpage: user});
            } else {
                next();
            }
        });
    }
});

module.exports = router;