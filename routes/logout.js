let express = require('express');
let router = express.Router();

let passport = require('passport');

router.get('/', function(req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;