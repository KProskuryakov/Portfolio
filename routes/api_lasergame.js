/**
 * Created by kosty on 4/16/2017.
 */
let express = require('express');
let router = express.Router();

let lasergameLevels = require('../postgresdb').lasergameLevels;

router.get('/:id', function (req, res, next) {
    let id = parseInt(req.params.id);
    lasergameLevels.getLevelByID(id, function(err, level) {
        if (err) return next(err);
        res.send(JSON.stringify(level));
    });
});

router.post('/upload', function(req, res, next) {
    if (req.user) {
        let content = req.body;
        console.log(content);
        lasergameLevels.insert(content.level_data, content.name, req.user.display_name, function(err, id) {
            if (err) return next(err);
            console.log('Level inserted with id: ' + id);
            res.send('Uploaded!');
        });
    } else {
        res.status(401).send('You must be logged in to upload!');
    }
});

module.exports = router;