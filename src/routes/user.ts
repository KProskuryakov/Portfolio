import express = require("express");
const router = express.Router();

import * as db_su from "../db/SiteUserTable";
import * as db_ll from "../lasergame/backend/LasergameLevelTable";

router.get("/:user", async (req, res, next) => {
  const user = await db_su.getSiteUserByDisplayName(req.params.user);
  if (!user) { return next(); }
  const levelArray = await db_ll.getAllLasergameLevelsOfSiteUser(user.display_name);
  res.render("user", { title: user.display_name, pageOwner: user, levelArray });
});

export default router;
