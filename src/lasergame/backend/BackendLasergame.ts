import seedrandom = require("seedrandom");
import winston = require("winston");

import Ending from "../Ending";
import Lasergrid from "../LaserGrid";
import Path from "../Path";
import Piece from "../Piece";
import Pieces from "../Pieces";
import Tile from "../Tile";

import * as db_ldl from "../../db/LasergameDailyLevelTable";
import LasergameDailyLevel from "../../db/models/LasergameDailyLevel";

const defaultGrid = new Lasergrid();
defaultGrid.calculateAllEndings();

export function generateLevelFromSeed(seed = Date.now(), difficulty = "medium") {
  let numPaths = 5;
  switch (difficulty) {
    case "easy":
      numPaths = 3;
      break;
    case "hard":
      numPaths = 7;
      break;
    case "expert":
      numPaths = 9;
      break;
    case "super-expert":
      numPaths = 11;
      break;
    case "monster":
      numPaths =  15;
      break;
    case "godlike":
    case "nightmare":
      numPaths = 20;
      break;
  }

  const rng = seedrandom(seed.toString());

  const interestingPaths: Path[] = [];
  const boringPaths: Path[] = [];

  const randomGrid = new Lasergrid();

  Pieces.forEach((piece: Piece) => {
    while (true) {
      const randTile = new Tile(Math.floor(rng() * 5), Math.floor(rng() * 5));
      if (!randomGrid.getPiece(randTile)) {
        randomGrid.setPiece(piece, randTile);
        break;
      }
    }
  });

  randomGrid.calculateAllEndings();

  const gridPaths = randomGrid.paths;

  for (let i = 0; i < gridPaths.length; i++) {
    if (!gridPaths[i].endingsEqual(defaultGrid.paths[i])) {
      interestingPaths.push(gridPaths[i]);
    } else {
      boringPaths.push(gridPaths[i]);
    }
  }

  // shuffle cleansedEndings
  shuffle(interestingPaths, rng);

  let randomPaths: Path[] = interestingPaths.slice(0, numPaths);

  if (randomPaths.length < numPaths) {
    shuffle(boringPaths, rng);
    randomPaths = randomPaths.concat(boringPaths.slice(0, numPaths - randomPaths.length));
  }

  randomPaths.sort((a, b) => a.start < b.start ? -1 : 1);

  return { level_data: randomPaths, seed, difficulty };
}

export async function getTodaysDailyLevel(): Promise<LasergameDailyLevel> {
  try {
    let level = await db_ldl.getDailyLevel("today");
    if (!level) {
      const randomLevel = generateLevelFromSeed();
      level = await db_ldl.insertDailyLevel(randomLevel.level_data, randomLevel.seed);
    }
    return Promise.resolve(level);
  } catch (err) {
    winston.error("Err: getTodaysDailyLevel() - " + err.message);
    return Promise.reject(err);
  }
}

function shuffle(paths: Path[], rng: any) {
  let m = paths.length;
  let t: Path; let i: number;
  while (m) {
    i = Math.floor(rng() * m--);

    t = paths[m];
    paths[m] = paths[i];
    paths[i] = t;
  }
}
