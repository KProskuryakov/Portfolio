import express = require("express");
const router = express.Router();

import * as webDataTable from "../db/web-data-table";

router.get("/", async (req, res, next) => {
  const webDataArray = await webDataTable.getAllWebDatas();
  res.render("webdata", { title: "Web Data", page: "Web Data", webDataArray });
});

module.exports = router;
