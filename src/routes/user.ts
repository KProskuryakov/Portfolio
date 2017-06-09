import express = require('express');
let router = express.Router();
// let users = require('../db').siteUsers;

import * as db_su from '../db/SiteUserTable';
import * as db_ll from '../db/LasergameLevelTable';

router.get('/:user', function (req, res, next) {
  db_su.getSiteUserByDisplayName(req.params.user, function onGetUser(err: Error, pageOwner) {
    if (err) return next(err);
    if (!pageOwner) next();
    db_ll.getAllLasergameLevelsOfSiteUser(pageOwner.display_name, function onGetAllLevelsOfPlayer(err: Error, levelArray) {
      if (err) return next(err);
      res.render('user', { title: pageOwner.display_name, pageOwner: pageOwner, levelArray: levelArray });
    });
  });
});

module.exports = router;