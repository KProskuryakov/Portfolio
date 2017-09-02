import { colorToRGBString } from "../../Color";
import Direction, { getOppositeDirection } from "../../Direction";
import LaserSegment, { copyLaserSegment, getOppositeLaserSegment } from "../../LaserSegment";
import PathsList from "../../PathsList";
import { applyPieceToLaser } from "../../PieceID";
import Tile, {
  addTiles, directionToTile, nextTile,
  subTiles, tileCompare, tileNotNegative, tileWithinAreaInclusive,
} from "../../Tile";

import LaserGrid, {
  edgeNumberToLaser, getPieceFromGrid, isValidSpace,
  makeDefaultGrid, removePieceFromGrid, setPieceInGrid, tileToEdgeNumber,
} from "../../LaserGrid";

import { availablePieces, edgeLevelData, pieceComponents, printPaths, toolbar } from "../FrontendLasergame";
import { TILE_FULL, TILE_HALF, tileToPixels } from "../FrontendTile";
import CanvasComponent from "./CanvasComponent";

export default class LaserGridComponent extends CanvasComponent {
  public lasergrid: LaserGrid;
  public selectedEdge: number;
  public drawPath: LaserSegment[];
  public importedPathsList: PathsList;

  constructor(
    src: string, tile: Tile, widthInTiles: number, heightInTiles: number, draw: () => void,
    offsetX = 0, offsetY = 0) {
    super(src, tile, widthInTiles, heightInTiles, draw, offsetX, offsetY);

    this.lasergrid = makeDefaultGrid();

    this.selectedEdge = 1;
    this.drawPath = [];
    this.importedPathsList = [];
  }

  public draw(ctx: CanvasRenderingContext2D) {
    super.draw(ctx);

    // Draw pieces on grid
    for (const piece of availablePieces) {
      if ((tileWithinAreaInclusive(piece.tile, {x: 0, y: 0}, {x: 4, y: 4}))) {
        pieceComponents[piece.pieceID].drawAt(addTiles(this.tile, piece.tile, { x: 1, y: 1 }), ctx);
      }
    }

    // Draw laser path on grid
    for (const laser of this.drawPath) {
      ctx.beginPath();
      ctx.strokeStyle = colorToRGBString(laser.color);
      const loc = tileToPixels(addTiles(laser.tile, { x: 1, y: 1 }));
      loc.px += TILE_HALF;
      loc.py += TILE_HALF;
      ctx.moveTo(loc.px, loc.py);
      const tilemap = directionToTile(laser.dir);
      ctx.lineTo(loc.px + tilemap.x * TILE_HALF, loc.py + tilemap.y * TILE_HALF);
      ctx.stroke();
    }

    // Draw selected edge marker on grid
    let selectedEdgePixels = tileToPixels(addTiles(edgeNumberToLaser(this.selectedEdge).tile, { x: 1, y: 1 }));
    ctx.strokeStyle = "#FFFFFF";
    ctx.beginPath();
    if (this.selectedEdge < 6) {
      ctx.moveTo(selectedEdgePixels.px + TILE_HALF - 5, selectedEdgePixels.py + TILE_FULL - 5);
      ctx.lineTo(selectedEdgePixels.px + TILE_HALF, selectedEdgePixels.py + TILE_FULL);
      ctx.lineTo(selectedEdgePixels.px + TILE_HALF + 5, selectedEdgePixels.py + TILE_FULL - 5);
    } else if (this.selectedEdge < 11) {
      ctx.moveTo(selectedEdgePixels.px + 5, selectedEdgePixels.py + TILE_HALF - 5);
      ctx.lineTo(selectedEdgePixels.px, selectedEdgePixels.py + TILE_HALF);
      ctx.lineTo(selectedEdgePixels.px + 5, selectedEdgePixels.py + TILE_HALF + 5);
    } else if (this.selectedEdge < 16) {
      ctx.moveTo(selectedEdgePixels.px + TILE_HALF - 5, selectedEdgePixels.py + 5);
      ctx.lineTo(selectedEdgePixels.px + TILE_HALF, selectedEdgePixels.py);
      ctx.lineTo(selectedEdgePixels.px + TILE_HALF + 5, selectedEdgePixels.py + 5);
    } else if (this.selectedEdge < 21) {
      ctx.moveTo(selectedEdgePixels.px + TILE_FULL - 5, selectedEdgePixels.py + TILE_HALF - 5);
      ctx.lineTo(selectedEdgePixels.px + TILE_FULL, selectedEdgePixels.py + TILE_HALF);
      ctx.lineTo(selectedEdgePixels.px + TILE_FULL - 5, selectedEdgePixels.py + TILE_HALF + 5);
    }
    ctx.stroke();

    // Draw level edge hints
    if (edgeLevelData) {
      ctx.globalAlpha = 0.1;
      for (const edgeData of edgeLevelData) {
        selectedEdgePixels = tileToPixels(addTiles(edgeNumberToLaser(edgeData.edge).tile, { x: 1, y: 1 }));
        ctx.fillStyle = edgeData.solved ? "#00FF00" : "#FF0000";
        ctx.fillRect(selectedEdgePixels.px, selectedEdgePixels.py, TILE_FULL, TILE_FULL);
      }
      ctx.globalAlpha = 1.0;
    }

    // Draw edge numbers
    for (let e = 1; e <= 20; e++) {
      selectedEdgePixels = tileToPixels(addTiles(edgeNumberToLaser(e).tile, { x: 1, y: 1 }));
      ctx.fillStyle = "#000000";
      ctx.font = "24px sans-serif";
      ctx.textBaseline = "middle";
      ctx.fillText(e.toString(), selectedEdgePixels.px + TILE_HALF - ctx.measureText(e.toString()).width / 2,
        selectedEdgePixels.py + TILE_HALF);
    }
  }

  public processMouseClick(x: number, y: number) {
    const relativeTile = super.processMouseClick(x, y);
    if (relativeTile !== null) {
      if (tileWithinAreaInclusive(relativeTile, { x: 1, y: 1 }, { x: 5, y: 5 })) {
        const loc = subTiles(relativeTile, { x: 1, y: 1 });
        const piece = getPieceFromGrid(this.lasergrid, loc);
        if (piece) {
          removePieceFromGrid(this.lasergrid, piece);
        } else {
          setPieceInGrid(this.lasergrid, availablePieces[toolbar.selectedPiece], loc);
        }
        printPaths();

        this.calculateDrawPathWrapper();
      }
      const newEdge = tileToEdgeNumber(addTiles(relativeTile, { x: -1, y: -1 }));
      if (newEdge !== 0) {
        this.selectedEdge = newEdge;
      }
      this.calculateDrawPathWrapper();
    }
    return relativeTile;
  }

  public calculateDrawPathWrapper() {
    this.drawPath = [];
    this.calculateDrawPath(edgeNumberToLaser(this.selectedEdge));
  }

  private calculateDrawPath(laser: LaserSegment) {
    for (let i = 0; i < 100; i++) {
      laser.tile = nextTile(laser.tile, laser.dir);
      if (!tileWithinAreaInclusive(laser.tile, { x: 0, y: 0 }, { x: 4, y: 4 })) {
        return;
      }
      const piece = getPieceFromGrid(this.lasergrid, laser.tile);
      this.drawPath.push(getOppositeLaserSegment(laser));
      if (piece) {
        applyPieceToLaser(laser, piece.pieceID);
        switch (laser.dir) {
          case Direction.SPLIT_NORTH_SOUTH:
            laser.dir = Direction.NORTH;
            this.drawPath.push(getOppositeLaserSegment(laser));
            this.calculateDrawPath(getOppositeLaserSegment(laser));
            break;
          case Direction.SPLIT_EAST_WEST:
            laser.dir = Direction.EAST;
            this.drawPath.push(getOppositeLaserSegment(laser));
            this.calculateDrawPath(getOppositeLaserSegment(laser));
            break;
          case Direction.NONE:
            return;
        }
      } // if piece is not null
      this.drawPath.push(copyLaserSegment(laser));
    }
  }
}
