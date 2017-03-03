var express = require('express');
var router = express.Router();

/* GET lasergame listing. */
router.get('/', function(req, res, next) {
    res.render('lasergame', {title: "Laser Game"})
});

module.exports = router;
