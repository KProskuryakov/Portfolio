import Color from "./Color";
import Direction from "./Direction";
import Ending, { End } from "./Ending";
import LaserSegment from "./LaserSegment";
import Path from "./Path";
import PieceID, { applyPieceToLaser } from "./PieceID";
import Tile, { nextTile, tileWithinAreaExclusive } from "./Tile";

export interface GridPiece {
  readonly pieceID: PieceID;
  tile: Tile;
}

export default interface LaserGrid {
  paths: Path[];
  readonly grid: GridPiece[][];
  readonly availablePieces: GridPiece[];
  readonly length: number;
  readonly width: number;
}

export function makeDefaultGrid(): LaserGrid {
  const grid = [];
  for (let i = 0; i < 5; i++) {
    grid[i] = [];
  }
  const newGrid = {
    paths: [] as Path[],
    grid: grid as GridPiece[][],
    availablePieces: [] as GridPiece[],
    length: 5, width: 5,
  };
  calculateAllEndings(newGrid);
  return newGrid;
}

export function makeCustomGrid(availablePieces: GridPiece[]): LaserGrid {
  const grid = [];
  for (let i = 0; i < 5; i++) {
    grid[i] = [];
  }
  const newGrid = {
    paths: [] as Path[],
    grid: grid as GridPiece[][],
    availablePieces,
    length: 5, width: 5,
  };
  calculateAllEndings(newGrid);
  return newGrid;
}

export function tileToEdgeNumber(tile: Tile) {
  const x = tile.x;
  const y = tile.y;
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

export function edgeNumberToLaser(edge: number): LaserSegment {
  if (edge < 6) {
    return { tile: { x: edge - 1, y: -1 }, dir: Direction.SOUTH, color: Color.BLACK };
  } else if (edge < 11) {
    return { tile: { x: 5, y: edge - 6 }, dir: Direction.WEST, color: Color.BLACK };
  } else if (edge < 16) {
    return { tile: { x: -edge + 15, y: 5 }, dir: Direction.NORTH, color: Color.BLACK };
  } else if (edge < 21) {
    return { tile: { x: -1, y: -edge + 20 }, dir: Direction.EAST, color: Color.BLACK };
  }
}

export function getPieceFromGrid(laserGrid: LaserGrid, tile: Tile) {
  return laserGrid.grid[tile.y][tile.x];
}

export function isValidSpace(laserGrid: LaserGrid, tile: Tile) {
  return tileWithinAreaExclusive(tile, { x: -1, y: -1 }, { x: laserGrid.width, y: laserGrid.length });
}

export function removePieceFromGrid(laserGrid: LaserGrid, piece: GridPiece, calculate = true): GridPiece {
  laserGrid.grid[piece.tile.y][piece.tile.x] = undefined;
  piece.tile = { x: -1, y: -1 };
  if (calculate) {
    calculateAllEndings(laserGrid);
  }
  return piece;
}

export function setPieceInGrid(laserGrid: LaserGrid, piece: GridPiece, tile: Tile): GridPiece {
  const currentPiece = getPieceFromGrid(laserGrid, tile);
  let removedPiece = null;
  if (currentPiece) {
    removedPiece = removePieceFromGrid(laserGrid, currentPiece, false);
  }
  piece.tile = tile;
  laserGrid.grid[tile.y][tile.x] = piece;
  calculateAllEndings(laserGrid);
  return removedPiece;
}

export function calculateAllEndings(laserGrid: LaserGrid) {
  const endings: Path[] = [];
  for (let i = 0; i < 20; i++) {
    endings[i] = { start: i + 1, endings: calculateEndingList(laserGrid, i + 1) };
  }
  laserGrid.paths = endings;
}

function calculateEndingList(laserGrid: LaserGrid, edge: number) {
  const endingList: Ending[] = [];

  function trackOneEnding(grid: LaserGrid, laser: LaserSegment) {
    for (let i = 0; i < 100; i++) {
      laser.tile = nextTile(laser.tile, laser.dir);
      if (!isValidSpace(grid, laser.tile)) {
        const endEdge = tileToEdgeNumber(laser.tile);
        endingList.push({ end: endEdge, color: laser.color });
        return;
      }
      const piece = getPieceFromGrid(grid, laser.tile);
      if (piece) {
        applyPieceToLaser(laser, piece.pieceID);
        switch (laser.dir) {
          case Direction.SPLIT_NORTH_SOUTH:
            laser.dir = Direction.NORTH;
            trackOneEnding(grid, { tile: laser.tile, dir: Direction.SOUTH, color: laser.color });
            break;
          case Direction.SPLIT_EAST_WEST:
            laser.dir = Direction.EAST;
            trackOneEnding(grid, { tile: laser.tile, dir: Direction.WEST, color: laser.color });
            break;
          case Direction.NONE:
            endingList.push({ end: End.Blocked, color: laser.color });
            return;
        }
      } // if piece is not null
    } // for
    endingList.push({ end: End.Loop, color: laser.color });
  } // trackOneEnding()

  trackOneEnding(laserGrid, edgeNumberToLaser(edge));
  endingList.sort((a, b) => a.end < b.end ? -1 : 1);
  return endingList;
}
