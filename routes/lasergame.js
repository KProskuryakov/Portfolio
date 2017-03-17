let express = require('express');
let router = express.Router();

let passport = require('../passport');
let co = require('co');
let users = require('../db').users;

/* GET lasergame listing. */
router.get('/', function(req, res) {
    if (req.query.username && req.query.level) {
        co(function* () {
            let level = yield users.getLasergameLevel(req.query.username, req.query.level);
            res.render('lasergame', {title: "Laser Game", data: level});
        });
    } else{
        res.render('lasergame', {title: "Laser Game", data: ""});
    }

});

router.post('/upload', function(req, res) {
    if (req.user) {
        co(function* () {
            try {
                let content = req.body;
                console.log(content);
                yield users.addLasergameLevel(req.user._id, content.level, content.name);
                res.send('Uploaded!');
            } catch (err) {
                console.log(err);
            }
        });
    } else {
        res.status(401).send('You must be logged in to upload!');
    }
});

module.exports = router;
