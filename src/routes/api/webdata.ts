import express = require('express')
let router = express.Router()

import WebData from '../../db/models/web-data'
import * as webDataTable from '../../db/web-data-table'

router.post("/insert", async (req, res, next) => {
  try {
    let webData = <WebData> req.body
    await webDataTable.insertWebData(webData)
    return res.send("Woo!")
  } catch (err) {
    if (err.message === "duplicate key value violates unique constraint \"web_data_pkey\"") {
      return res.status(519).send()
    }
    return next(err);
  }
})

module.exports = router