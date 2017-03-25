let express = require('express');
let router = express.Router();

let bcrypt = require('bcrypt');
const users = require('../db').users;
const pgUsers = require('../postgresdb').pgUsers;

const co = require('co');

router.get('/', function(req, res) {
    res.render('register', {title: "Register"});
});

router.post('/', co.wrap(function* (req, res, next) {

    // Get our form values. These rely on the "name" attributes
    let username = req.body.username;
    let userPassword = req.body.password;

    let user = yield users.findByUsername(username);

    if (user) {
        res.redirect('/register');
    } else {
        let hash = yield bcrypt.hash(userPassword, 10);
        // yield users.insert(username, hash);
        yield pgUsers.insert(username, hash, next);
        res.redirect('/')
        // let user = yield users.findByUsername(username);
        // req.login(user, function(err) {
        //     if (err) {
        //         return next(err);
        //     }
        //     res.redirect('/');
        // });
    }
}));

module.exports = router;