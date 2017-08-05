import Direction from "./Direction";
import Ending from "./Ending";
import EndType from "./EndType";
import Laser from "./Laser";
import Mirror from "./Mirror";
import Path from "./Path";
import Piece from "./Piece";
import Swatch from "./Swatch";
import Tile from "./Tile";

export default class LaserGrid {
  /**
   * Returns a laser with the given properties based on the edge it originated from
   */
  public static edgeNumberToLaser(edge: number) {
    if (edge < 6) {
      return new Laser(new Tile(edge - 1, -1), Direction.South);
    } else if (edge < 11) {
      return new Laser(new Tile(5, edge - 6), Direction.West);
    } else if (edge < 16) {
      return new Laser(new Tile(-edge + 15, 5), Direction.North);
    } else if (edge < 21) {
      return new Laser(new Tile(-1, -edge + 20), Direction.East);
    }
    throw Error(`Edge ${edge} is invalid to turn into a laser.`);
  }

  /**
   */
  public static tileToEdgeNumber(tile: Tile) {
    const x = tile.tileX;
    const y = tile.tileY;
    if (y === -1 && x > -1 && x < 5) {
      return 1 + x;
    } else if (x === 5 && y > -1 && y < 5) {
      return 6 + y;
    } else if (y === 5 && x > -1 && x < 5) {
      return 15 - x;
    } else if (x === -1 && y > -1 && y < 5) {
      return 20 - y;
    }
    return 0;
  }
  public paths: Path[];
  private grid: Piece[][] | null[][];

  constructor() {
    this.grid = [];
    for (let i = 0; i < 5; i++) {
      this.grid[i] = [];
      for (let j = 0; j < 5; j++) {
        this.grid[i][j] = null;
      }
    }
  }

  public removePiece(piece: Piece) {
    if (piece.tile.isValid()) {
      this.grid[piece.tile.tileY][piece.tile.tileX] = null;
      piece.tile = new Tile(-1, -1);
    }
    this.calculateAllEndings();
  }

  public setPiece(piece: Piece, tile: Tile) {
    this.removePiece(piece);
    this.grid[tile.tileY][tile.tileX] = piece;
    piece.tile = tile;
    this.calculateAllEndings();
  }

  public getPiece(tile: Tile) {
    return this.grid[tile.tileY][tile.tileX];
  }

  public calculateAllEndings() {
    const endings: Path[] = [];
    for (let i = 0; i < 20; i++) {
      endings[i] = new Path(i + 1, this.calculateEndingList(i + 1));
    }
    this.paths = endings;
  }

  public calculateEndingList(edge: number) {
    const endingList: Ending[] = [];

    function trackOneEnding(grid: LaserGrid, laser: Laser) {
      for (let i = 0; i < 100; i++) {
        laser.tile = laser.tile.nextTile(laser.dir);
        if (!laser.tile.isValid(5, 5)) {
          const endEdge = LaserGrid.tileToEdgeNumber(laser.tile);
          endingList.push(new Ending(endEdge, laser.color));
          return;
        }
        const piece = grid.getPiece(laser.tile);
        if (piece) {
          if (piece instanceof Mirror) {
            laser.dir = piece.dirs[laser.dir];
            switch (laser.dir) {
              case Direction.SplitNorthSouth:
                laser.dir = Direction.North;
                trackOneEnding(grid, new Laser(laser.tile, Direction.South, laser.color));
                break;
              case Direction.SplitEastWest:
                laser.dir = Direction.East;
                trackOneEnding(grid, new Laser(laser.tile, Direction.West, laser.color));
                break;
              case Direction.None:
                endingList.push(new Ending(EndType.Blocked, laser.color));
                return;
            }
          } else if (piece instanceof Swatch) {
            laser.color = laser.color.add(piece.color);
          }
        } // if piece is not null
      } // for
      endingList.push(new Ending(EndType.Loop, laser.color));
    } // trackOneEnding()

    trackOneEnding(this, LaserGrid.edgeNumberToLaser(edge));
    return endingList;
  }
}
