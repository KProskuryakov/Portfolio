/**
 * Route: /api/lasergame/
 */

import express = require('express')
let router = express.Router()

import * as db_ll from '../../db/LasergameLevelTable'
import * as db_ldl from '../../db/LasergameDailyLevelTable'
import { generateLevelFromSeed, getTodaysDailyLevel } from '../../lasergame-backend/lasergame'

router.get('/seed/:seed', (req, res, next) => {
  let seed = req.params.seed
  let seededLevel = generateLevelFromSeed(seed)
  res.send(JSON.stringify(seededLevel))
})

router.get('/daily', async (req, res, next) => {
  try {
    let level = await getTodaysDailyLevel()
    return res.send(JSON.stringify(level))
  } catch (err) {
    return res.send(JSON.stringify(err))
  }
})

router.get('/daily/:date', async (req, res, next) => {
  let level = await db_ldl.getDailyLevel(req.params.date)
  if (!level) {
    return res.sendStatus(404)
  } else {
    return res.send(JSON.stringify(level))
  }
})

router.get('/level/:id', async (req, res, next) => {
  try {
    let id = parseInt(req.params.id)
    let level = await db_ll.getLasergameLevelByID(id)
    res.send(JSON.stringify(level))
  } catch (err) {
    next(err)
  }
})

router.post('/upload', async (req, res, next) => {
  if (req.user) {
    let content = req.body
    console.log(content)
    let id = await db_ll.insertLasergameLevel(content.level_data, content.name, req.user.display_name)
    console.log('Level inserted with id: ' + id)
    res.send('Uploaded!')
  } else {
    res.status(401).send('You must be logged in to upload!')
  }
})

export = router