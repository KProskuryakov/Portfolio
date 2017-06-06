import Lasergrid from '../lasergame-frontend/classes/lasergrid';
import { pieces } from '../lasergame-frontend/pieces';
import Piece from '../lasergame-frontend/classes/piece';
import Tile from '../lasergame-frontend/classes/tile';
import Ending from '../lasergame-frontend/classes/ending';
import Path from '../lasergame-frontend/classes/path';

import * as db_ldl from '../db/LasergameDailyLevelTable';
import LasergameDailyLevel from '../db/models/LasergameDailyLevel';
let seedrandom = require('seedrandom');

let defaultGrid = new Lasergrid();
defaultGrid.calculateAllEndings();

export function generateLevelFromSeed(seed = Date.now()) {
  let rng = seedrandom(seed);

  let success = false;
  let cleansedEndings: Path[];
  while (!success) {   // in case the random grid isn't interesting enough somehow
    let randomGrid = new Lasergrid();

    pieces.forEach((piece: Piece) => {
      while (true) {
        let randTile = new Tile(Math.floor(rng() * 5), Math.floor(rng() * 5));
        if (!randomGrid.getPiece(randTile)) {
          randomGrid.setPiece(piece, randTile);
          break;
        }
      }
    });

    randomGrid.calculateAllEndings();

    let gridEndings = randomGrid.paths;

    cleansedEndings = [];

    for (let i = 1; i < gridEndings.length; i++) {
      if (!gridEndings[i].endingsEqual(defaultGrid.paths[i])) {
        cleansedEndings.push(gridEndings[i]);
      }
    }
    if (cleansedEndings.length >= 5) {
      success = true;
    }
  } // while !success

  // shuffle cleansedEndings
  let m = cleansedEndings.length;
  let t: Path; let i: number;
  while (m) {
    let i = Math.floor(rng() * m--);

    t = cleansedEndings[m];
    cleansedEndings[m] = cleansedEndings[i];
    cleansedEndings[i] = t;
  }

  let randomEndings: Path[] = cleansedEndings.slice(0, 5);

  randomEndings.sort((a, b) => { return a.start < b.start ? -1 : 1 });

  return { level_data: randomEndings, seed };
}

export function getTodaysDailyLevel(callback: (err: Error, level: LasergameDailyLevel) => void) {
  db_ldl.getTodaysDailyLevel((err, level) => {
    if (!level) {
      let randomLevel = generateLevelFromSeed();
      db_ldl.insertDailyLevel(randomLevel.level_data, randomLevel.seed, (err, newLevel) => {
        if (newLevel) {
          console.log(`New lasergame daily level generated for date: ${newLevel.daily_date}`); // TODO Proper logging
          callback(err, newLevel);
        } else {
          console.log('Lasergame daily level failed to be inserted for today');
          console.log(err);
        }
      });
    } else {
      console.log(`Lasergame daily level fetched for date: ${level.daily_date}`);
      callback(err, level);
    }
  });
}

export function getDailyLevel(date: string, callback: (err: Error, level: LasergameDailyLevel) => void) {
  db_ldl.getDailyLevel(date, (err, level) => {
    if (err) return callback(err, null);
    return callback(null, level);
  });
}