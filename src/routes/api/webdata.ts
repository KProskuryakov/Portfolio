import express = require("express");
const router = express.Router();

import IWebData from "../../db/models/WebData";
import * as webDataTable from "../../db/WebDataTable";

router.post("/insert", async (req, res, next) => {
  try {
    const webData = req.body as IWebData;
    await webDataTable.insertWebData(webData);
    return res.send("Woo!");
  } catch (err) {
    if (err.message === "duplicate key value violates unique constraint \"web_data_pkey\"") {
      return res.status(519).send();
    }
    return next(err);
  }
});

export default router;
