let express = require('express');
let router = express.Router();

let lasergameLevels = require('../postgresdb').lasergameLevels;

/* GET lasergame listing. */
router.get('/', function(req, res) {
    if (req.query.id) {
        res.render('lasergame', {title: "Laser Game", levelID: req.query.id});
    } else {
        res.render('lasergame', {title: "Laser Game", levelID: ""});
    }
});

module.exports = router;
