import { canvas, importPre, pathsPre, victoryP, ctx } from './htmlelements'
import { Direction, End, Pieces, LevelType } from './enum'
import { PathsList } from './interfaces'
import Toolbar from './classes/toolbar'
import LaserGridComponent from './classes/lasergrid_component'
import PieceComponent from './classes/piece_component'
import Tile from './classes/tile'
import Piece from './classes/piece'
import Mirror from './classes/mirror'
import Swatch from './classes/swatch'
import Ending from './classes/ending'
import Color from './classes/color'
import Path from './classes/path'
import { pieces } from './pieces'

import LasergameDailyLevel from '../db/models/lasergame-daily-level'

export const toolbar: Toolbar = new Toolbar("/lasergame/toolbar.png", new Tile(0, 7), 8, 1, draw)
export const lasergridComponent: LaserGridComponent = new LaserGridComponent("/lasergame/lasergrid.png", new Tile(0, 0), 7, 7, draw)

export const pieceComponents: Array<PieceComponent> = []

let currentLevel: Path[]
export let edgeLevelData: {edge: number, solved: boolean}[]
let levelType: LevelType = LevelType.Custom

/**
 * Inits the things that aren't constants
 */
function init() {
  canvas.addEventListener("click", onClick, false)

  pieceComponents[Pieces.ForwardSlash] = new PieceComponent(pieces[Pieces.ForwardSlash], "/lasergame/pieces/mirror_forwardslash.png", draw)
  pieceComponents[Pieces.BackSlash] = new PieceComponent(pieces[Pieces.BackSlash], "/lasergame/pieces/mirror_backslash.png", draw)
  pieceComponents[Pieces.BlackHole] = new PieceComponent(pieces[Pieces.BlackHole], "/lasergame/pieces/mirror_blackhole.png", draw)
  pieceComponents[Pieces.SideSplit] = new PieceComponent(pieces[Pieces.SideSplit], "/lasergame/pieces/mirror_sidesplit.png", draw)
  pieceComponents[Pieces.UpSplit] = new PieceComponent(pieces[Pieces.UpSplit], "/lasergame/pieces/mirror_upsplit.png", draw)
  pieceComponents[Pieces.Blue] = new PieceComponent(pieces[Pieces.Blue], "/lasergame/pieces/swatch_blue.png", draw)
  pieceComponents[Pieces.Red] = new PieceComponent(pieces[Pieces.Red], "/lasergame/pieces/swatch_red.png", draw)
  pieceComponents[Pieces.Green] = new PieceComponent(pieces[Pieces.Green], "/lasergame/pieces/swatch_green.png", draw)

  lasergridComponent.lasergrid.calculateAllEndings()
  printPaths()
  lasergridComponent.calculateDrawPathWrapper()
}
 
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = "#9c9a9b"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  lasergridComponent.draw(ctx)
  toolbar.draw(ctx)
}

function onClick(event: any) {
  let loc = windowToCanvas(event.clientX, event.clientY)
  lasergridComponent.processMouseClick(loc.x, loc.y)
  toolbar.processMouseClick(loc.x, loc.y)
  printPaths()
  if (currentLevel && checkVictory()) {
    if (levelType === LevelType.Random) {
      victoryP.innerHTML = "Incredible! You won! <a href=\"/lasergame/random\">Click here to generate a new random puzzle!</a>"
    } else if (levelType === LevelType.Daily) {
      victoryP.textContent = "Wow! You beat the daily level!"
    } else if (levelType === LevelType.Custom) {
      victoryP.textContent = "Wow! You beat the custom level!"
    }
    victoryP.hidden = false
  }
  draw()
}

function populateEdgeLevelData() {
  if (currentLevel) {
    edgeLevelData = []
    for (let p = 0; p < currentLevel.length; p++) {
      let path = currentLevel[p]
      let edge = path.start
      let solved = false
      if (path.endingsEqual(lasergridComponent.lasergrid.paths[path.start-1])) {
        solved = true
      }
      edgeLevelData.push({edge, solved})
    }
  }
}

function checkVictory(): boolean {
  for (let p = 0; p < edgeLevelData.length; p++) {
    if (!edgeLevelData[p].solved) {
      return false
    }
  }
  return true
}

export function printPaths() {
  if (currentLevel) {
    populateEdgeLevelData()
    printLevelPaths()
  } else {
    printAllPaths()
  }
}

function printAllPaths() {
  pathsPre.innerHTML = ""
  let paths = lasergridComponent.lasergrid.paths
  for (let i = 0; i < 20; i++) {
    let curPath = paths[i]
    let line = curPath.toString()
    if (lasergridComponent.selectedEdge === i+1) {
      line = `><b>${line}</b>`
    }
    pathsPre.innerHTML += line
    if (i < 19) {
      pathsPre.innerHTML += "\n"
    }
  }
}

function printLevelPaths() {
  pathsPre.innerHTML = ""
  let paths = lasergridComponent.lasergrid.paths
  for (let i = 0; i < currentLevel.length; i++) {
    let levelPath = currentLevel[i]
    let curPath = paths[levelPath.start-1]
    let line = levelPath.toString()
    if (curPath.endingsEqual(levelPath)) {
      line = `<span style='color: green'>${line}</span>`
    } else { 
      line = `<span style='color: red'>${line}</span>`
    }
    if (lasergridComponent.selectedEdge === levelPath.start) {
      line = `><b>${line}</b>`
    }
    pathsPre.innerHTML += line

    if (i < currentLevel.length - 1) {
      pathsPre.innerHTML += "\n"
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
  let bbox = canvas.getBoundingClientRect()

  return {
    x: x - bbox.left * (canvas.width / bbox.width),
    y: y - bbox.top * (canvas.height / bbox.height)
  }
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
      alert('Must be logged in to upload a level!')
    } else {
      alert('Level uploaded! (Probably)')
    }
  })
}

export function getLevel(seed: string) {
  window.fetch(`/api/lasergame/seed/${seed}`, {
    method: 'GET',
    credentials: 'same-origin'
  }).then(function (response) {
    response.json().then((randomLevel: LasergameDailyLevel) => { // TODO change to LasergameLevel as soon as it's normalized
      levelType = LevelType.Random
      let levelData = randomLevel.level_data
      let seed = randomLevel.seed
      console.log(seed)
      currentLevel = []
      for (let i = 0; i < levelData.length; i++) {
        currentLevel.push(Path.fromJSONObject(levelData[i]))
      }
      printPaths()
      draw()
    })
  })
}

export function getDailyLevel() {
  window.fetch('/api/lasergame/daily', {
    method: 'GET',
    credentials: 'same-origin'
  }).then((response) => {
    response.json().then((dailyLevel: LasergameDailyLevel) => {
      levelType = LevelType.Daily
      let levelData = dailyLevel.level_data
      let seed = dailyLevel.seed
      console.log(seed)
      currentLevel = []
      for (let i = 0; i < levelData.length; i++) {
        currentLevel.push(Path.fromJSONObject(levelData[i]))
      }
      printPaths()
      draw()
    })
  })
}

init()