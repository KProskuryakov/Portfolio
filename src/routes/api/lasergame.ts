/**
 * Route: /api/lasergame/
 */

import express = require("express");
const router = express.Router();

import { generateLevelFromSeed, getTodaysDailyLevel } from "../../lasergame/backend/BackendLasergame";
import * as db_ldl from "../../lasergame/backend/LasergameDailyLevelTable";
import * as db_ll from "../../lasergame/backend/LasergameLevelTable";

import winston from "winston";

router.get("/seed/:difficulty/:seed", (req, res, next) => {
  const seed = req.params.seed;
  const difficulty = req.params.difficulty;
  const seededLevel = generateLevelFromSeed(seed, difficulty);
  res.send(JSON.stringify(seededLevel));
});

router.get("/daily", async (req, res, next) => {
  try {
    const level = await getTodaysDailyLevel();
    return res.send(JSON.stringify(level));
  } catch (err) {
    return res.send(JSON.stringify(err));
  }
});

router.get("/daily/:date", async (req, res, next) => {
  const level = await db_ldl.getDailyLevel(req.params.date);
  if (!level) {
    return res.sendStatus(404);
  } else {
    return res.send(JSON.stringify(level));
  }
});

router.get("/level/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const level = await db_ll.getLasergameLevelByID(id);
    res.send(JSON.stringify(level));
  } catch (err) {
    next(err);
  }
});

router.post("/upload", async (req, res, next) => {
  if (req.user) {
    const content = req.body;
    winston.info(content);
    const id = await db_ll.insertLasergameLevel(content.level_data, content.name, req.user.display_name);
    winston.info("Level inserted with id: " + id);
    res.send("Uploaded!");
  } else {
    res.status(401).send("You must be logged in to upload!");
  }
});

export default router;
