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
  const availablePieces: GridPiece[] = [];
  for (let i = 0; i < 8; i++) {
    availablePieces[i] = {pieceID: i, tile: {x: -1, y: -1}};
  }

  const newGrid: LaserGrid = {
    paths: [] as Path[],
    grid: grid as GridPiece[][],
    availablePieces,
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

export function tileToEdgeNumber(laserGrid: LaserGrid, tile: Tile) {
  const x = tile.x;
  const y = tile.y;
  if (y === -1 && x > -1 && x < laserGrid.width) {
    return 1 + x;
  } else if (x === laserGrid.width && y > -1 && y < laserGrid.length) {
    return 1 + laserGrid.width + y;
  } else if (y === laserGrid.length && x > -1 && x < laserGrid.width) {
    return laserGrid.width * 2 + laserGrid.length - x;
  } else if (x === -1 && y > -1 && y < laserGrid.length) {
    return laserGrid.width * 2 + laserGrid.length * 2 - y;
  }
  throw Error(`LaserGrid #tileToEdgeNumber invalid tile given: ${tile}`);
}

export function edgeNumberToLaser(edge: number): LaserSegment {
  if (edge < 1 || edge > 20) {
    throw Error(`LaserGrid #edgeNumberToLaser invalid edge number given ${edge}`);
  }
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
  if (!isValidSpace(laserGrid, tile)) {
    throw Error(`LaserGrid #getPieceFromGrid tile out of bounds ${tile}`);
  }
  return laserGrid.grid[tile.y][tile.x];
}

export function isValidSpace(laserGrid: LaserGrid, tile: Tile) {
  return tileWithinAreaExclusive(tile, { x: -1, y: -1 }, { x: laserGrid.width, y: laserGrid.length });
}

export function removePieceFromGrid(laserGrid: LaserGrid, piece: GridPiece): GridPiece {
  if (!isValidSpace(laserGrid, piece.tile) || piece !== laserGrid.grid[piece.tile.y][piece.tile.x]) {
    throw Error(`LaserGrid #removePieceFromGrid piece not valid ${piece}`);
  }
  laserGrid.grid[piece.tile.y][piece.tile.x] = undefined;
  piece.tile = { x: -1, y: -1 };
  calculateAllEndings(laserGrid);
  return piece;
}

export function setPieceInGrid(laserGrid: LaserGrid, piece: GridPiece, tile: Tile): GridPiece {
  if (!isValidSpace(laserGrid, tile)) {
    throw Error(`LaserGrid #setPieceInGrid tile not valid ${tile}`);
  }
  const removedPiece = getPieceFromGrid(laserGrid, tile);
  if (removedPiece) {
    laserGrid.grid[removedPiece.tile.y][removedPiece.tile.x] = undefined;
    removedPiece.tile = { x: -1, y: -1 };
  }
  if (isValidSpace(laserGrid, piece.tile)) {
    laserGrid.grid[piece.tile.y][piece.tile.x] = undefined;
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
        const endEdge = tileToEdgeNumber(grid, laser.tile);
        endingList.push({ end: endEdge, color: laser.color });
        return;
      }
      const piece = getPieceFromGrid(grid, laser.tile);
      if (piece) {
        applyPieceToLaser(laser, piece.pieceID);
        switch (laser.dir) {
          case Direction.SPLIT_WEST_TO_VERT:
            laser.dir = Direction.NORTH;
            trackOneEnding(grid, { tile: laser.tile, dir: Direction.SOUTH, color: laser.color });
            break;
          case Direction.SPLIT_SOUTH_TO_HORI:
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
