import express = require('express');
let router = express.Router();

import SiteUser from '../db/models/SiteUser';
import * as db_su from '../db/SiteUserTable';

router.get('/', function (req, res, next) {
  db_su.getAllSiteUsers(function onGetAll(err: Error, userArray: SiteUser[]) {
    if (err) next(err);
    res.render('users', { title: "All Users", page: "All Users", userArray: userArray });
  });
});

module.exports = router;