let express = require('express');
let router = express.Router();

router.get('/:user', function (req, res, next) {
    if (req.user && req.params.user === req.user.username) {
        res.render('user', {userpage: req.user});
    } else {
        let db = req.db;
        let collection = db.get('usercollection');
        collection.findOne({username: req.params.user}).then((doc) => {
            if (doc) {
                res.render('user', {userpage: doc});
            } else {
                next();
            }
        });
    }
});

module.exports = router;