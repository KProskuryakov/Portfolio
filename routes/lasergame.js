/**
 * Created by kosty on 3/2/2017.
 */
var express = require('express');
var router = express.Router();

/* GET lasergame listing. */
router.get('/', function(req, res, next) {
    res.render('lasergame')
});

module.exports = router;
