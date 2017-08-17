import LasergameDailyLevel from "../../db/models/LasergameDailyLevel";

import Color from "../Color";
import Direction from "../Direction";
import Ending from "../Ending";
import EndType from "../EndType";
import LevelType from "../LevelType";
import Mirror from "../Mirror";
import Path from "../Path";
import PathsList from "../PathsList";
import Piece from "../Piece";
import Pieces from "../Pieces";
import PieceType from "../PieceType";
import Swatch from "../Swatch";
import Tile from "../Tile";

import LaserGridComponent from "./components/LaserGridComponent";
import PieceComponent from "./components/PieceComponent";
import ToolbarComponent from "./components/ToolbarComponent";

import { canvas, ctx, importPre, pathsPre, victoryP } from "./HTMLElements";

export const toolbar = new ToolbarComponent("/lasergame/toolbar.png", new Tile(0, 7), 8, 1, draw);
export const lasergridComponent = new LaserGridComponent("/lasergame/lasergrid.png", new Tile(0, 0), 7, 7, draw);

export const pieceComponents: PieceComponent[] = [];

let currentLevel: Path[];
export let edgeLevelData: Array<{ edge: number, solved: boolean }>;
let levelType: LevelType = LevelType.Custom;
let difficulty = "medium";

/**
 * Inits the things that aren't constants
 */
function init() {
  canvas.addEventListener("click", onClick, false);

  pieceComponents[PieceType.ForwardSlash] = new PieceComponent(Pieces[PieceType.ForwardSlash],
    "/lasergame/pieces/mirror_forwardslash.png", draw);
  pieceComponents[PieceType.BackSlash] = new PieceComponent(Pieces[PieceType.BackSlash],
  "/lasergame/pieces/mirror_backslash.png", draw);
  pieceComponents[PieceType.BlackHole] = new PieceComponent(Pieces[PieceType.BlackHole],
    "/lasergame/pieces/mirror_blackhole.png", draw);
  pieceComponents[PieceType.SideSplit] = new PieceComponent(Pieces[PieceType.SideSplit],
    "/lasergame/pieces/mirror_sidesplit.png", draw);
  pieceComponents[PieceType.UpSplit] = new PieceComponent(Pieces[PieceType.UpSplit],
    "/lasergame/pieces/mirror_upsplit.png", draw);
  pieceComponents[PieceType.Blue] = new PieceComponent(Pieces[PieceType.Blue],
    "/lasergame/pieces/swatch_blue.png", draw);
  pieceComponents[PieceType.Red] = new PieceComponent(Pieces[PieceType.Red],
    "/lasergame/pieces/swatch_red.png", draw);
  pieceComponents[PieceType.Green] = new PieceComponent(Pieces[PieceType.Green],
    "/lasergame/pieces/swatch_green.png", draw);

  lasergridComponent.lasergrid.calculateAllEndings();
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
      if (path.endingsEqual(lasergridComponent.lasergrid.paths[path.start - 1])) {
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
    let line = curPath.toString();
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
    let line = levelPath.toString();
    line = curPath.endingsEqual(levelPath) ? `<span style='color: green'>${line}</span>`
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
    response.json().then((randomLevel: LasergameDailyLevel) => {
      levelType = LevelType.Random;
      const levelData = randomLevel.level_data;
      const newSeed = randomLevel.seed;
      currentLevel = [];
      for (const data of levelData) {
        currentLevel.push(Path.fromJSONObject(data));
      }
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
        currentLevel.push(Path.fromJSONObject(data));
      }
      printPaths();
      draw();
    });
  });
}

init();
