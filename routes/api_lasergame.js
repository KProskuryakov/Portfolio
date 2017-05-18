"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var router = express.Router();
var postgresdb_1 = require("../postgresdb");
router.get('/:id', function (req, res, next) {
    var id = parseInt(req.params.id);
    postgresdb_1.lasergameLevels.getLevelByID(id, function (err, level) {
        if (err)
            return next(err);
        res.send(JSON.stringify(level));
    });
});
router.post('/upload', function (req, res, next) {
    if (req.user) {
        var content = req.body;
        console.log(content);
        postgresdb_1.lasergameLevels.insert(content.level_data, content.name, req.user.display_name, function (err, id) {
            if (err)
                return next(err);
            console.log('Level inserted with id: ' + id);
            res.send('Uploaded!');
        });
    }
    else {
        res.status(401).send('You must be logged in to upload!');
    }
});
module.exports = router;
