import express = require("express");
const router = express.Router();
// let users = require('../db').siteUsers

import * as db_ll from "../db/lasergame-level-table";
import * as db_su from "../db/site-user-table";

router.get("/:user", async (req, res, next) => {
  const user = await db_su.getSiteUserByDisplayName(req.params.user);
  if (!user) { return next(); }
  const levelArray = await db_ll.getAllLasergameLevelsOfSiteUser(user.display_name);
  res.render("user", { title: user.display_name, pageOwner: user, levelArray });
});

module.exports = router;
