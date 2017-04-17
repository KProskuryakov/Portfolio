let express = require('express');
let router = express.Router();

let passport = require('../passport');

router.get('/', function(req, res) {
    if (req.user) {
        res.send('woo!');
    } else {
        res.status(401).send('Not logged in!');
    }
});

module.exports = router;