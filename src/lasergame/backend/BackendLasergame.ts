import seedrandom = require("seedrandom");
import winston = require("winston");

import Ending from "../Ending";
import LaserGrid, { getPieceFromGrid, GridPiece, makeCustomGrid, makeDefaultGrid, setPieceInGrid } from "../LaserGrid";
import Path, { equalPaths } from "../Path";
import Tile from "../Tile";

import * as db_ldl from "./LasergameDailyLevelTable";
import LasergameDailyLevel from "./LasergameDailyLevelTable";

const defaultGrid = makeDefaultGrid();

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

  const availablePieces: GridPiece[] = [];

  for (let i = 0; i < 8; i++) {
    availablePieces[i] = {pieceID: Math.floor(rng() * 8), tile: {x: -1, y: -1}};
  }

  const randomGrid = makeCustomGrid(availablePieces);

  randomGrid.availablePieces.forEach((piece: GridPiece) => {
    while (true) {
      const randTile: Tile = {x: Math.floor(rng() * 5), y: Math.floor(rng() * 5)};
      if (!getPieceFromGrid(randomGrid, randTile)) {
        setPieceInGrid(randomGrid, piece, randTile);
        break;
      }
    }
  });

  const gridPaths = randomGrid.paths;

  for (let i = 0; i < gridPaths.length; i++) {
    if (!equalPaths(gridPaths[i], defaultGrid.paths[i])) {
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

  for (const piece of availablePieces) {
    piece.tile = {x: -1, y: -1};
  }

  return { levelData: {paths: randomPaths, availablePieces}, seed, difficulty };
}

export async function getTodaysDailyLevel(): Promise<LasergameDailyLevel> {
  try {
    let level = await db_ldl.getDailyLevel("today");
    if (!level) {
      const randomLevel = generateLevelFromSeed();
      level = await db_ldl.insertDailyLevel(randomLevel.levelData, randomLevel.seed);
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
