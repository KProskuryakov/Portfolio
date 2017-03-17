let express = require('express');
let router = express.Router();

const users = require('../db').users;
const co = require('co');

router.get('/', co.wrap(function* (req, res) {
    let allUsers = yield users.findAllUsernames();
    res.render('users', {title: "All Users", allUsers: allUsers});
}));

module.exports = router;