import LaserGrid from './lasergrid'
import { PathsList } from '../interfaces'
import Laser from "./laser"
import CanvasComponent from './canvas_component'
import Tile from './tile'
import { TILE_HALF, TILE_FULL, directionMapping } from '../const'
import { toolbar, printPaths, pieceComponents, edgeLevelData } from '../lasergame'
import Mirror from './mirror'
import Swatch from './swatch'
import { Direction, End } from '../enum'

export default class LaserGridComponent extends CanvasComponent {
  lasergrid: LaserGrid
  selectedEdge: number
  drawPath: Laser[]
  importedPathsList: PathsList

  constructor(src: string, tile: Tile, widthInTiles: number, heightInTiles: number, draw: () => void, offsetX = 0, offsetY = 0) {
    super(src, tile, widthInTiles, heightInTiles, draw, offsetX, offsetY)

    this.lasergrid = new LaserGrid()

    this.selectedEdge = 1
    this.drawPath = []
    this.importedPathsList = []
  }

  draw(ctx: CanvasRenderingContext2D) {
    super.draw(ctx)

    // Draw pieces on grid
    for (let i = 0; i < pieceComponents.length; i++) {
      let pieceComponent = pieceComponents[i]
      let piece = pieceComponent.piece
      if (piece.tile.isValid()) {
        pieceComponent.drawAt(this.tile.add(piece.tile).add(new Tile(1, 1)), ctx)
      }
    }

    // Draw laser path on grid
    for (let i = 0; i < this.drawPath.length; i++) {
      ctx.beginPath()
      let laser = this.drawPath[i]
      ctx.strokeStyle = laser.color.toRGBString()
      let loc = laser.tile.add(new Tile(1, 1)).toPixels()
      loc.x += TILE_HALF
      loc.y += TILE_HALF
      ctx.moveTo(loc.x, loc.y)
      let tilemap = directionMapping[laser.dir]
      ctx.lineTo(loc.x + tilemap.tileX * TILE_HALF, loc.y + tilemap.tileY * TILE_HALF)
      ctx.stroke()
    }

    // Draw selected edge marker on grid
    let selectedEdgePixels = LaserGrid.edgeNumberToLaser(this.selectedEdge).tile.add(new Tile(1, 1)).toPixels()
    ctx.strokeStyle = '#FFFFFF'
    ctx.beginPath()
    if (this.selectedEdge < 6) {
      ctx.moveTo(selectedEdgePixels.x + TILE_HALF - 5, selectedEdgePixels.y + TILE_FULL - 5)
      ctx.lineTo(selectedEdgePixels.x + TILE_HALF, selectedEdgePixels.y + TILE_FULL)
      ctx.lineTo(selectedEdgePixels.x + TILE_HALF + 5, selectedEdgePixels.y + TILE_FULL - 5)
    } else if (this.selectedEdge < 11) {
      ctx.moveTo(selectedEdgePixels.x + 5, selectedEdgePixels.y + TILE_HALF - 5)
      ctx.lineTo(selectedEdgePixels.x, selectedEdgePixels.y + TILE_HALF)
      ctx.lineTo(selectedEdgePixels.x + 5, selectedEdgePixels.y + TILE_HALF + 5)
    } else if (this.selectedEdge < 16) {
      ctx.moveTo(selectedEdgePixels.x + TILE_HALF - 5, selectedEdgePixels.y + 5)
      ctx.lineTo(selectedEdgePixels.x + TILE_HALF, selectedEdgePixels.y)
      ctx.lineTo(selectedEdgePixels.x + TILE_HALF + 5, selectedEdgePixels.y + 5)
    } else if (this.selectedEdge < 21) {
      ctx.moveTo(selectedEdgePixels.x + TILE_FULL - 5, selectedEdgePixels.y + TILE_HALF - 5)
      ctx.lineTo(selectedEdgePixels.x + TILE_FULL, selectedEdgePixels.y + TILE_HALF)
      ctx.lineTo(selectedEdgePixels.x + TILE_FULL - 5, selectedEdgePixels.y + TILE_HALF + 5)
    }
    ctx.stroke()

    // Draw level edge hints
    if (edgeLevelData) {
      ctx.globalAlpha = 0.1
      for (let e = 0; e < edgeLevelData.length; e++) {
        let edgeData = edgeLevelData[e]
        let selectedEdgePixels = LaserGrid.edgeNumberToLaser(edgeData.edge).tile.add(new Tile(1, 1)).toPixels()
        if (edgeData.solved) {
          ctx.fillStyle = "#00FF00"
        } else {
          ctx.fillStyle = "#FF0000"
        }
        ctx.fillRect(selectedEdgePixels.x, selectedEdgePixels.y, TILE_FULL, TILE_FULL)
      }
      ctx.globalAlpha = 1.0
    }

    for (let e = 1; e <= 20; e++) {
      let selectedEdgePixels = LaserGrid.edgeNumberToLaser(e).tile.add(new Tile(1, 1)).toPixels()
      ctx.fillStyle = "#000000"
      ctx.font = "24px sans-serif"
      ctx.textBaseline = "middle"
      ctx.fillText(e.toString(), selectedEdgePixels.x + TILE_HALF - ctx.measureText(e.toString()).width / 2, selectedEdgePixels.y + TILE_HALF)
    }
  }

  processMouseClick(x: number, y: number) {
    let relativeTile = super.processMouseClick(x, y)
    if (relativeTile !== null) {
      if (relativeTile.compare(new Tile(1, 1), (v1: number, v2: number) => v1 >= v2) && relativeTile.compare(new Tile(5, 5), (v1: number, v2: number) => v1 <= v2)) {
        let loc = relativeTile.minus(new Tile(1, 1))
        let piece = this.lasergrid.getPiece(loc)
        if (piece !== null) {
          this.lasergrid.removePiece(piece)
        } else {
          this.lasergrid.setPiece(toolbar.getSelectedPieceComponent().piece, loc)
        }
        printPaths()
        
        this.calculateDrawPathWrapper()
      }
      let newEdge = LaserGrid.tileToEdgeNumber(relativeTile.add(new Tile(-1, -1)))
      if (newEdge !== 0) {
        this.selectedEdge = newEdge
      }
      this.calculateDrawPathWrapper()
    }
    return relativeTile
  }

  calculateDrawPathWrapper() {
    this.drawPath = []
    this.calculateDrawPath(LaserGrid.edgeNumberToLaser(this.selectedEdge))
  }

  /**
   *
   */
  calculateDrawPath(laser: Laser) {
    for (let i = 0; i < 100; i++) {
      laser.tile = laser.tile.nextTile(laser.dir)
      if (!laser.tile.isValid(5, 5)) {
        return
      }
      let piece = this.lasergrid.getPiece(laser.tile)
      this.drawPath.push(laser.getOppositeLaser())
      if (piece) {
        if (piece instanceof Mirror) {
          laser.dir = piece.dirs[laser.dir]
          switch (laser.dir) {
            case Direction.SplitNorthSouth:
              laser.dir = Direction.North
              this.drawPath.push(laser.getOppositeLaser())
              this.calculateDrawPath(new Laser(laser.tile, Direction.South, laser.color))
              break
            case Direction.SplitEastWest:
              laser.dir = Direction.East
              this.drawPath.push(laser.getOppositeLaser())
              this.calculateDrawPath(new Laser(laser.tile, Direction.West, laser.color))
              break
            case Direction.None:
              return
          }
        } else if (piece instanceof Swatch) {
          laser.color = laser.color.add(piece.color)
        }
      } // if piece is not null
      this.drawPath.push(laser.copy())
    }
  }
}