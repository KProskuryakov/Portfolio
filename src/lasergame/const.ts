import Tile from './classes/tile';
import Piece from './classes/piece';
import Swatch from './classes/swatch';
import { Direction } from './enum';

export const importPre = <HTMLPreElement>document.getElementById("imported-pre");
export const pathsPre = <HTMLPreElement>document.getElementById("paths-pre");
export const canvas = <HTMLCanvasElement>document.getElementById("laser-game-canvas");

export const ctx = canvas.getContext("2d");

export const TILE_FULL = 50;
export const TILE_HALF = TILE_FULL / 2;

export const directionMapping: Tile[] = [];
export const oppositeDirection: Direction[] = [];
export const pieces: Array<Piece | Swatch> = [];

directionMapping[Direction.North] = new Tile(0, -1);
directionMapping[Direction.East] = new Tile(1, 0);
directionMapping[Direction.South] = new Tile(0, 1);
directionMapping[Direction.West] = new Tile(-1, 0);

oppositeDirection[Direction.North] = Direction.South;
oppositeDirection[Direction.East] = Direction.West;
oppositeDirection[Direction.South] = Direction.North;
oppositeDirection[Direction.West] = Direction.East;