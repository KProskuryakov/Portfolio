import { canvas, importPre, pathsPre, ctx } from './htmlelements';
import { Direction, End, Pieces } from './enum';
import { PathsList } from './interfaces'
import Toolbar from './classes/toolbar';
import LaserGridComponent from './classes/lasergrid_component';
import PieceComponent from './classes/piece_component';
import Tile from './classes/tile';
import Piece from './classes/piece';
import Mirror from './classes/mirror';
import Swatch from './classes/swatch';
import Ending from './classes/ending';
import Color from './classes/color';
import Path from './classes/path';
import { pieces } from './pieces';

export const toolbar = new Toolbar("toolbar.png", new Tile(0, 7), 8, 1, draw);
export const lasergridComponent = new LaserGridComponent("lasergrid.png", new Tile(0, 0), 7, 7, draw);

export const pieceComponents: Array<PieceComponent> = [];

let currentLevel: Path[] = null;

/**
 * Inits the things that aren't constants
 */
function init() {
  canvas.addEventListener("click", onClick, false);

  pieceComponents[Pieces.ForwardSlash] = new PieceComponent(pieces[Pieces.ForwardSlash], "pieces/mirror_forwardslash.png", draw);
  pieceComponents[Pieces.BackSlash] = new PieceComponent(pieces[Pieces.BackSlash], "pieces/mirror_backslash.png", draw);
  pieceComponents[Pieces.BlackHole] = new PieceComponent(pieces[Pieces.BlackHole], "pieces/mirror_blackhole.png", draw);
  pieceComponents[Pieces.SideSplit] = new PieceComponent(pieces[Pieces.SideSplit], "pieces/mirror_sidesplit.png", draw);
  pieceComponents[Pieces.UpSplit] = new PieceComponent(pieces[Pieces.UpSplit], "pieces/mirror_upsplit.png", draw);
  pieceComponents[Pieces.Blue] = new PieceComponent(pieces[Pieces.Blue], "pieces/swatch_blue.png", draw);
  pieceComponents[Pieces.Red] = new PieceComponent(pieces[Pieces.Red], "pieces/swatch_red.png", draw);
  pieceComponents[Pieces.Green] = new PieceComponent(pieces[Pieces.Green], "pieces/swatch_green.png", draw);

  lasergridComponent.lasergrid.calculateAllEndings();
  printPaths();
  lasergridComponent.calculateDrawPathWrapper();
  getRandomLevel();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#bcbcbc';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  lasergridComponent.draw(ctx);
  toolbar.draw(ctx);
}

function onClick(event: any) {
  let loc = windowToCanvas(event.clientX, event.clientY);
  lasergridComponent.processMouseClick(loc.x, loc.y);
  toolbar.processMouseClick(loc.x, loc.y);
  draw();
}

function importLevel(levelID: number) {
  if (!levelID) return;
  window.fetch(`/api/lasergame/${levelID}`, {
    method: 'GET',
    credentials: 'same-origin'
  }).then(function (response) {
    return response.json();
  }).then(function (parsedJSON) {
    let tempPathsList = parsedJSON.level_data;
    let newPathsList: PathsList = [null];
    for (let i = 1; i <= 20; i++) {

      let arrayOfEndings = tempPathsList[i];
      let newArrayOfEndings = [];
      for (let j = 0; j < arrayOfEndings.length; j++) {
        newArrayOfEndings[j] = Ending.fromJSON(arrayOfEndings[j]);
      }
      newPathsList[i] = newArrayOfEndings;
    }

    lasergridComponent.importedPathsList = newPathsList;

    printPaths();
  }).catch(function (err) {
    alert('Import Level Failed!' + err); //TODO better error handling here
  });
}

export function printPaths() {
  pathsPre.innerHTML = "";
  let paths = lasergridComponent.lasergrid.paths;
  let curLevelNum = 0;
  for (let i = 1; i <= 20; i++) {
    let curPath = paths[i];
    let line = curPath.toString();
    if (currentLevel && curLevelNum < 5) {
      let levelPath = currentLevel[curLevelNum];
      if (levelPath.start === i) {
        line += ` (${levelPath.endingListToString()})`
        if (curPath.endingsEqual(levelPath)) {
          line = `<span style='color: green'>${line}</span>`
        } else { 
          line = `<span style='color: red'>${line}</span>`
        }
        curLevelNum++;
      }
    }
    pathsPre.innerHTML += line;

    if (i < 20) {
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
  let bbox = canvas.getBoundingClientRect();

  return {
    x: x - bbox.left * (canvas.width / bbox.width),
    y: y - bbox.top * (canvas.height / bbox.height)
  };
}

function uploadPaths() {
  window.fetch('/api/lasergame/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin',
    body: JSON.stringify({ level_data: lasergridComponent.lasergrid.paths, name: "test" })
  }).then(function (response) {
    if (response.status === 401) {
      alert('Must be logged in to upload a level!');
    } else {
      alert('Level uploaded! (Probably)');
    }
  });
}

function getRandomLevel() {
  window.fetch('/api/lasergame/random', {
    method: 'GET',
    credentials: 'same-origin'
  }).then(function (response) {
    response.json().then((value: Path[]) => {
      currentLevel = [];
      for (let i = 0; i < value.length; i++) {
        currentLevel.push(Path.fromJSONObject(value[i]));
      }
      printPaths();
    });
  });
}

init();
