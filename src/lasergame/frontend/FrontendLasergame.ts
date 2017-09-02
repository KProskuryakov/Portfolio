import LasergameDailyLevel from "../backend/LasergameDailyLevelTable";

import Color from "../Color";
import Direction from "../Direction";
import Ending, { endingsEqual } from "../Ending";
import LevelType from "../LevelType";
import Path, { equalPaths } from "../Path";
import PathsList from "../PathsList";
import PieceID from "../PieceID";
import Tile from "../Tile";

import LaserGridComponent from "./components/LaserGridComponent";
import PieceComponent from "./components/PieceComponent";
import ToolbarComponent from "./components/ToolbarComponent";

import { calculateAllEndings, GridPiece } from "../LaserGrid";
import { pathToString } from "./FrontendPath";
import { canvas, ctx, importPre, pathsPre, victoryP } from "./HTMLElements";

export const toolbar = new ToolbarComponent("/lasergame/toolbar.png", { x: 0, y: 7 }, 8, 1, draw);
export const lasergridComponent = new LaserGridComponent("/lasergame/lasergrid.png", { x: 0, y: 0 }, 7, 7, draw);

export const pieceComponents: PieceComponent[] = [];

let currentLevel: Path[];
export let availablePieces: GridPiece[] = [];
export let edgeLevelData: Array<{ edge: number, solved: boolean }>;
let levelType: LevelType = LevelType.Custom;
let difficulty = "medium";

/**
 * Inits the things that aren't constants
 */
function init() {
  canvas.addEventListener("click", onClick, false);

  pieceComponents[PieceID.FORWARD_SLASH] = new PieceComponent(PieceID.FORWARD_SLASH,
    "/lasergame/pieces/mirror_forwardslash.png", draw);
  pieceComponents[PieceID.BACK_SLASH] = new PieceComponent(PieceID.BACK_SLASH,
    "/lasergame/pieces/mirror_backslash.png", draw);
  pieceComponents[PieceID.BLACK_HOLE] = new PieceComponent(PieceID.BLACK_HOLE,
    "/lasergame/pieces/mirror_blackhole.png", draw);
  pieceComponents[PieceID.HORI_SPLIT] = new PieceComponent(PieceID.HORI_SPLIT,
    "/lasergame/pieces/mirror_sidesplit.png", draw);
  pieceComponents[PieceID.VERT_SPLIT] = new PieceComponent(PieceID.VERT_SPLIT,
    "/lasergame/pieces/mirror_upsplit.png", draw);

  pieceComponents[PieceID.BLUE] = new PieceComponent(PieceID.BLUE,
    "/lasergame/pieces/swatch_blue.png", draw);
  pieceComponents[PieceID.RED] = new PieceComponent(PieceID.RED,
    "/lasergame/pieces/swatch_red.png", draw);
  pieceComponents[PieceID.GREEN] = new PieceComponent(PieceID.GREEN,
    "/lasergame/pieces/swatch_green.png", draw);

  for (let i = 0; i < 8; i++) {
    availablePieces[i] = {pieceID: i, tile: {x: -1, y: -1}};
  }

  calculateAllEndings(lasergridComponent.lasergrid);
  printPaths();
  lasergridComponent.calculateDrawPathWrapper();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#9c9a9b";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  lasergridComponent.draw(ctx);
  toolbar.draw(ctx);
}

function onClick(event: any) {
  const loc = windowToCanvas(event.clientX, event.clientY);
  lasergridComponent.processMouseClick(loc.x, loc.y);
  toolbar.processMouseClick(loc.x, loc.y);
  printPaths();
  if (currentLevel && checkVictory()) {
    if (levelType === LevelType.Random) {
      victoryP.innerHTML = `Incredible! You won! <a href=\"/lasergame/random/${difficulty}\">`
        + `Click here to generate a new random puzzle!</a>`;
    } else if (levelType === LevelType.Daily) {
      victoryP.textContent = "Wow! You beat the daily level!";
    } else if (levelType === LevelType.Custom) {
      victoryP.textContent = "Wow! You beat the custom level!";
    }
    victoryP.hidden = false;
  }
  draw();
}

function populateEdgeLevelData() {
  if (currentLevel) {
    edgeLevelData = [];
    for (const path of currentLevel) {
      const edge = path.start;
      let solved = false;
      if (equalPaths(path, lasergridComponent.lasergrid.paths[path.start - 1])) {
        solved = true;
      }
      edgeLevelData.push({ edge, solved });
    }
  }
}

function checkVictory(): boolean {
  for (const data of edgeLevelData) {
    if (!data.solved) {
      return false;
    }
  }
  return true;
}

export function printPaths() {
  if (currentLevel) {
    populateEdgeLevelData();
    printLevelPaths();
  } else {
    printAllPaths();
  }
}

function printAllPaths() {
  pathsPre.innerHTML = "";
  const paths = lasergridComponent.lasergrid.paths;
  for (let i = 0; i < 20; i++) {
    const curPath = paths[i];
    let line = pathToString(curPath);
    if (lasergridComponent.selectedEdge === i + 1) {
      line = `><b>${line}</b>`;
    }
    pathsPre.innerHTML += line;
    if (i < 19) {
      pathsPre.innerHTML += "\n";
    }
  }
}

function printLevelPaths() {
  pathsPre.innerHTML = "";
  const paths = lasergridComponent.lasergrid.paths;
  for (let i = 0; i < currentLevel.length; i++) {
    const levelPath = currentLevel[i];
    const curPath = paths[levelPath.start - 1];
    let line = pathToString(levelPath);
    line = equalPaths(curPath, levelPath) ? `<span style='color: green'>${line}</span>`
      : `<span style='color: red'>${line}</span>`;
    if (lasergridComponent.selectedEdge === levelPath.start) {
      line = `><b>${line}</b>`;
    }
    pathsPre.innerHTML += line;

    if (i < currentLevel.length - 1) {
      pathsPre.innerHTML += "\n";
    }
  }
}

/**
 * Converts the x, y pixel coordinates from window position to relative canvas position
 * @param {number} x clientX
 * @param {number} y clientY
 * @returns {{x: number, y: number}} a relative location to the canvas
 */
function windowToCanvas(x: number, y: number) {
  const bbox = canvas.getBoundingClientRect();

  return {
    x: x - bbox.left * (canvas.width / bbox.width),
    y: y - bbox.top * (canvas.height / bbox.height),
  };
}

function uploadPaths() {
  window.fetch("/api/lasergame/upload", {
    body: JSON.stringify({ level_data: lasergridComponent.lasergrid.paths, name: "test" }),
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  }).then((response) => {
    if (response.status === 401) {
      alert("Must be logged in to upload a level!");
    } else {
      alert("Level uploaded! (Probably)");
    }
  });
}

export function getLevel(seed: string, difficultyString: string) {
  difficulty = difficultyString;
  window.fetch(`/api/lasergame/seed/${difficultyString}/${seed}`, {
    credentials: "same-origin",
    method: "GET",
  }).then((response) => {
    response.json().then((randomLevel) => {
      levelType = LevelType.Random;
      const levelData = randomLevel.levelData;
      const newSeed = randomLevel.seed;
      currentLevel = [];
      for (const data of levelData.paths) {
        currentLevel.push(data);
      }
      availablePieces = levelData.availablePieces;
      printPaths();
      draw();
    });
  });
}

export function getDailyLevel() {
  window.fetch("/api/lasergame/daily", {
    credentials: "same-origin",
    method: "GET",
  }).then((response) => {
    response.json().then((dailyLevel: LasergameDailyLevel) => {
      levelType = LevelType.Daily;
      const levelData = dailyLevel.level_data;
      const seed = dailyLevel.seed;
      currentLevel = [];
      for (const data of levelData) {
        currentLevel.push(data);
      }
      printPaths();
      draw();
    });
  });
}

init();
