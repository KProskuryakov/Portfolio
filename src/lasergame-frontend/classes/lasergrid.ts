import Laser from "./laser";
import { TILE_HALF, directionMapping } from '../const';
import { Direction, End } from '../enum';
import { toolbar, logCurrentPaths, logImportPaths, pieces } from '../lasergame';
import { PathsList } from '../interfaces';
import CanvasComponent from './canvas_component';
import Piece from './grid_piece';
import Tile from './tile';
import Mirror from './mirror';
import Swatch from './swatch';
import Ending from './ending';

export default class LaserGrid {
  grid: Piece[][];
  paths: Ending[][];

  constructor() {
    this.grid = [];
    for (let i = 0; i < 5; i++) {
      this.grid[i] = [];
      for (let j = 0; j < 5; j++) {
        this.grid[i][j] = null;
      }
    }
  }   

  removePiece(piece: Piece) {
    if (piece.tile.isValid()) {
      this.grid[piece.tile.tileY][piece.tile.tileX] = null;
      piece.tile = new Tile(-1, -1);
    }
    this.calculateAllEndings();
  }

  setPiece(piece: Piece, tile: Tile) {
    this.removePiece(piece);
    this.grid[tile.tileY][tile.tileX] = piece;
    piece.tile = tile;
    this.calculateAllEndings();
  }

  getPiece(tile: Tile) {
    return this.grid[tile.tileY][tile.tileX];
  }

  calculateAllEndings() {
    let endings: Ending[][] = [];
    for (let i = 1; i <= 20; i++) {
      endings[i] = this.calculateEndingList(i);
    }
    this.paths = endings;
  }

  calculateEndingList(edge: number) {
    let ending: Ending[] = [];

    function trackOneEnding(self: LaserGrid, laser: Laser) {
      for (let i = 0; i < 100; i++) {
        laser.tile = laser.tile.nextTile(laser.dir);
        if (!laser.tile.isValid(5, 5)) {
          let endEdge = LaserGrid.tileToEdgeNumber(laser.tile);
          ending.push(new Ending(endEdge, laser.color));
          return;
        }
        let piece = self.getPiece(laser.tile);
        if (piece) {
          if (piece instanceof Mirror) {
            laser.dir = piece.dirs[laser.dir];
            switch (laser.dir) {
              case Direction.SplitNorthSouth:
                laser.dir = Direction.North;
                trackOneEnding(self, new Laser(laser.tile, Direction.South, laser.color));
                break;
              case Direction.SplitEastWest:
                laser.dir = Direction.East;
                trackOneEnding(self, new Laser(laser.tile, Direction.West, laser.color));
                break;
              case Direction.None:
                ending.push(new Ending(End.Blocked, laser.color));
                return;
            }
          } else if (piece instanceof Swatch) {
            laser.color = laser.color.add(piece.color);
          }
        } // if piece is not null
      } // for
      ending.push(new Ending(End.Loop, laser.color));
    } // trackOneEnding()

    trackOneEnding(this, LaserGrid.edgeNumberToLaser(edge));
    return ending;
  }

  /**
   */
  addEndingToPaths(edge: number, ending: Ending) {
    if (!this.paths[edge]) {
      this.paths[edge] = []
    }
    this.paths[edge].push(ending);
  }

  /**
   * Returns a laser with the given properties based on the edge it originated from
   */
  static edgeNumberToLaser(edge: number) {
    if (edge < 6) {
      return new Laser(new Tile(edge - 1, -1), Direction.South);
    } else if (edge < 11) {
      return new Laser(new Tile(5, edge - 6), Direction.West);
    } else if (edge < 16) {
      return new Laser(new Tile(-edge + 15, 5), Direction.North);
    } else if (edge < 21) {
      return new Laser(new Tile(-1, -edge + 20), Direction.East);
    }
  }

  /**
   */
  static tileToEdgeNumber(tile: Tile) {
    let x = tile.tileX;
    let y = tile.tileY;
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

}