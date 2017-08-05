import express = require("express");
const router = express.Router();

import SiteUser from "../db/models/SiteUser";
import * as db_su from "../db/SiteUserTable";

router.get("/", async (req, res, next) => {
  const userArray = await db_su.getAllSiteUsers();
  res.render("users", { title: "All Users", page: "All Users", userArray });
});

export default router;
