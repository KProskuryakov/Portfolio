import { directionMapping, TILE_FULL, TILE_HALF } from "../const";
import { Direction, End } from "../enum";
import { IPathsList } from "../interfaces";
import { edgeLevelData, pieceComponents, printPaths, toolbar } from "../lasergame";
import CanvasComponent from "./canvas_component";
import Laser from "./laser";
import LaserGrid from "./lasergrid";
import Mirror from "./mirror";
import Swatch from "./swatch";
import Tile from "./tile";

export default class LaserGridComponent extends CanvasComponent {
  public lasergrid: LaserGrid;
  public selectedEdge: number;
  public drawPath: Laser[];
  public importedPathsList: IPathsList;

  constructor(src: string, tile: Tile, widthInTiles: number, heightInTiles: number, draw: () => void,
              offsetX = 0, offsetY = 0) {
    super(src, tile, widthInTiles, heightInTiles, draw, offsetX, offsetY);

    this.lasergrid = new LaserGrid();

    this.selectedEdge = 1;
    this.drawPath = [];
    this.importedPathsList = [];
  }

  public draw(ctx: CanvasRenderingContext2D) {
    super.draw(ctx);

    // Draw pieces on grid
    for (const pieceComponent of pieceComponents) {
      const piece = pieceComponent.piece;
      if (piece.tile.isValid()) {
        pieceComponent.drawAt(this.tile.add(piece.tile).add(new Tile(1, 1)), ctx);
      }
    }

    // Draw laser path on grid
    for (const laser of this.drawPath) {
      ctx.beginPath();
      ctx.strokeStyle = laser.color.toRGBString();
      const loc = laser.tile.add(new Tile(1, 1)).toPixels();
      loc.x += TILE_HALF;
      loc.y += TILE_HALF;
      ctx.moveTo(loc.x, loc.y);
      const tilemap = directionMapping[laser.dir];
      ctx.lineTo(loc.x + tilemap.tileX * TILE_HALF, loc.y + tilemap.tileY * TILE_HALF);
      ctx.stroke();
    }

    // Draw selected edge marker on grid
    let selectedEdgePixels = LaserGrid.edgeNumberToLaser(this.selectedEdge).tile.add(new Tile(1, 1)).toPixels();
    ctx.strokeStyle = "#FFFFFF";
    ctx.beginPath();
    if (this.selectedEdge < 6) {
      ctx.moveTo(selectedEdgePixels.x + TILE_HALF - 5, selectedEdgePixels.y + TILE_FULL - 5);
      ctx.lineTo(selectedEdgePixels.x + TILE_HALF, selectedEdgePixels.y + TILE_FULL);
      ctx.lineTo(selectedEdgePixels.x + TILE_HALF + 5, selectedEdgePixels.y + TILE_FULL - 5);
    } else if (this.selectedEdge < 11) {
      ctx.moveTo(selectedEdgePixels.x + 5, selectedEdgePixels.y + TILE_HALF - 5);
      ctx.lineTo(selectedEdgePixels.x, selectedEdgePixels.y + TILE_HALF);
      ctx.lineTo(selectedEdgePixels.x + 5, selectedEdgePixels.y + TILE_HALF + 5);
    } else if (this.selectedEdge < 16) {
      ctx.moveTo(selectedEdgePixels.x + TILE_HALF - 5, selectedEdgePixels.y + 5);
      ctx.lineTo(selectedEdgePixels.x + TILE_HALF, selectedEdgePixels.y);
      ctx.lineTo(selectedEdgePixels.x + TILE_HALF + 5, selectedEdgePixels.y + 5);
    } else if (this.selectedEdge < 21) {
      ctx.moveTo(selectedEdgePixels.x + TILE_FULL - 5, selectedEdgePixels.y + TILE_HALF - 5);
      ctx.lineTo(selectedEdgePixels.x + TILE_FULL, selectedEdgePixels.y + TILE_HALF);
      ctx.lineTo(selectedEdgePixels.x + TILE_FULL - 5, selectedEdgePixels.y + TILE_HALF + 5);
    }
    ctx.stroke();

    // Draw level edge hints
    if (edgeLevelData) {
      ctx.globalAlpha = 0.1;
      for (const edgeData of edgeLevelData) {
        selectedEdgePixels = LaserGrid.edgeNumberToLaser(edgeData.edge).tile.add(new Tile(1, 1)).toPixels();
        ctx.fillStyle = edgeData.solved ? "#00FF00" : "#FF0000";
        ctx.fillRect(selectedEdgePixels.x, selectedEdgePixels.y, TILE_FULL, TILE_FULL);
      }
      ctx.globalAlpha = 1.0;
    }

    // Draw edge numbers
    for (let e = 1; e <= 20; e++) {
      selectedEdgePixels = LaserGrid.edgeNumberToLaser(e).tile.add(new Tile(1, 1)).toPixels();
      ctx.fillStyle = "#000000";
      ctx.font = "24px sans-serif";
      ctx.textBaseline = "middle";
      ctx.fillText(e.toString(), selectedEdgePixels.x + TILE_HALF - ctx.measureText(e.toString()).width / 2,
        selectedEdgePixels.y + TILE_HALF);
    }
  }

  public processMouseClick(x: number, y: number) {
    const relativeTile = super.processMouseClick(x, y);
    if (relativeTile !== null) {
      if (relativeTile.compare(new Tile(1, 1), (v1: number, v2: number) => v1 >= v2)
        && relativeTile.compare(new Tile(5, 5), (v1: number, v2: number) => v1 <= v2)) {
        const loc = relativeTile.minus(new Tile(1, 1));
        const piece = this.lasergrid.getPiece(loc);
        if (piece !== null) {
          this.lasergrid.removePiece(piece);
        } else {
          this.lasergrid.setPiece(toolbar.getSelectedPieceComponent().piece, loc);
        }
        printPaths();

        this.calculateDrawPathWrapper();
      }
      const newEdge = LaserGrid.tileToEdgeNumber(relativeTile.add(new Tile(-1, -1)));
      if (newEdge !== 0) {
        this.selectedEdge = newEdge;
      }
      this.calculateDrawPathWrapper();
    }
    return relativeTile;
  }

  public calculateDrawPathWrapper() {
    this.drawPath = [];
    this.calculateDrawPath(LaserGrid.edgeNumberToLaser(this.selectedEdge));
  }

  /**
   *
   */
  private calculateDrawPath(laser: Laser) {
    for (let i = 0; i < 100; i++) {
      laser.tile = laser.tile.nextTile(laser.dir);
      if (!laser.tile.isValid(5, 5)) {
        return;
      }
      const piece = this.lasergrid.getPiece(laser.tile);
      this.drawPath.push(laser.getOppositeLaser());
      if (piece) {
        if (piece instanceof Mirror) {
          laser.dir = piece.dirs[laser.dir];
          switch (laser.dir) {
            case Direction.SplitNorthSouth:
              laser.dir = Direction.North;
              this.drawPath.push(laser.getOppositeLaser());
              this.calculateDrawPath(new Laser(laser.tile, Direction.South, laser.color));
              break;
            case Direction.SplitEastWest:
              laser.dir = Direction.East;
              this.drawPath.push(laser.getOppositeLaser());
              this.calculateDrawPath(new Laser(laser.tile, Direction.West, laser.color));
              break;
            case Direction.None:
              return;
          }
        } else if (piece instanceof Swatch) {
          laser.color = laser.color.add(piece.color);
        }
      } // if piece is not null
      this.drawPath.push(laser.copy());
    }
  }
}
