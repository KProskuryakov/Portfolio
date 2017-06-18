import express = require('express')
let router = express.Router()
// let users = require('../db').siteUsers

import * as db_su from '../db/site-user-table'
import * as db_ll from '../db/lasergame-level-table'

router.get('/:user', async function (req, res, next) {
  let user = await db_su.getSiteUserByDisplayName(req.params.user)
  if (!user) return next()
  let levelArray = await db_ll.getAllLasergameLevelsOfSiteUser(user.display_name)
  res.render('user', { title: user.display_name, pageOwner: user, levelArray: levelArray })
})

module.exports = router