import express = require('express')
let router = express.Router()

import SiteUser from '../db/models/site-user'
import * as db_su from '../db/site-user-table'

router.get('/', async function (req, res, next) {
  let userArray = await db_su.getAllSiteUsers()
  res.render('users', { title: "All Users", page: "All Users", userArray })
})

module.exports = router