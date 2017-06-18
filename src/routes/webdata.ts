import express = require('express')
let router = express.Router()

import * as webDataTable from '../db/web-data-table'

router.get('/', async function (req, res, next) {
  let webDataArray = await webDataTable.getAllWebDatas()
  res.render('webdata', { title: "Web Data", page: "Web Data", webDataArray })
})

module.exports = router