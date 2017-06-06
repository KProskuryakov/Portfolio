import express = require('express');
let router = express.Router();

import SiteUser, * as db_su from '../db/site_user';

router.get('/', function (req, res, next) {
  db_su.getAllSiteUsers(function onGetAll(err: Error, userArray: SiteUser[]) {
    if (err) next(err);
    res.render('users', { title: "All Users", userArray: userArray });
  });
});

module.exports = router;