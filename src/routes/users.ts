import express = require("express");
const router = express.Router();

import SiteUser from "db/models/site-user";
import * as db_su from "db/site-user-table";

router.get("/", async (req, res, next) => {
  const userArray = await db_su.getAllSiteUsers();
  res.render("users", { title: "All Users", page: "All Users", userArray });
});

export default router;
