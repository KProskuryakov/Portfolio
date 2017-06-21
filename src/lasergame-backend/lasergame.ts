import Lasergrid from '../lasergame-frontend/classes/lasergrid'
import { pieces } from '../lasergame-frontend/pieces'
import Piece from '../lasergame-frontend/classes/piece'
import Tile from '../lasergame-frontend/classes/tile'
import Ending from '../lasergame-frontend/classes/ending'
import Path from '../lasergame-frontend/classes/path'

import * as db_ldl from '../db/lasergame-daily-level-table'
import LasergameDailyLevel from '../db/models/lasergame-daily-level'
let seedrandom = require('seedrandom')

let defaultGrid = new Lasergrid()
defaultGrid.calculateAllEndings()

export function generateLevelFromSeed(seed = Date.now(), difficulty = "medium") {
  let numPaths = 5
  switch (difficulty) {
    case "easy":
      numPaths = 3
      break
    case "hard":
      numPaths = 7
      break
    case "expert":
      numPaths = 9
      break
    case "godlike":
      numPaths = 11
      break
  }

  let rng = seedrandom(seed)

  let success = false
  let cleansedPaths: Path[] = []
  while (!success) {   // in case the random grid isn't interesting enough somehow
    let randomGrid = new Lasergrid()

    pieces.forEach((piece: Piece) => {
      while (true) {
        let randTile = new Tile(Math.floor(rng() * 5), Math.floor(rng() * 5))
        if (!randomGrid.getPiece(randTile)) {
          randomGrid.setPiece(piece, randTile)
          break
        }
      }
    })

    randomGrid.calculateAllEndings()

    let gridPaths = randomGrid.paths

    cleansedPaths = []

    for (let i = 0; i < gridPaths.length; i++) {
      if (!gridPaths[i].endingsEqual(defaultGrid.paths[i])) {
        cleansedPaths.push(gridPaths[i])
      }
    }
    if (cleansedPaths.length >= numPaths) {
      success = true
    }
  } // while !success

  // shuffle cleansedEndings
  let m = cleansedPaths.length
  let t: Path; let i: number
  while (m) {
    let i = Math.floor(rng() * m--)

    t = cleansedPaths[m]
    cleansedPaths[m] = cleansedPaths[i]
    cleansedPaths[i] = t
  }

  let randomPaths: Path[] = cleansedPaths.slice(0, numPaths)

  randomPaths.sort((a, b) => { return a.start < b.start ? -1 : 1 })

  return { level_data: randomPaths, seed }
}

export async function getTodaysDailyLevel(): Promise<LasergameDailyLevel> {
  try {
    let level = await db_ldl.getDailyLevel('today')
    if (!level) {
      let randomLevel = generateLevelFromSeed()
      level = await db_ldl.insertDailyLevel(randomLevel.level_data, randomLevel.seed)
    }
    return Promise.resolve(level)
  } catch (err) {
    console.log("Err: getTodaysDailyLevel() - " + err.message)
    return Promise.reject(err)
  }
}