import express = require('express');
let router = express.Router();

/* GET lasergame listing. */
router.get('/', function(req, res) {
    if (req.query.id) {
        res.render('lasergame', {title: "Laser Game", levelID: req.query.id});
    } else {
        res.render('lasergame', {title: "Laser Game"});
    }
});

module.exports = router;
