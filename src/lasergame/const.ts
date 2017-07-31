import { Direction } from "lasergame/enum";
import Piece from "lasergame/piece";
import Swatch from "lasergame/swatch";
import Tile from "lasergame/tile";

export const TILE_FULL = 50;
export const TILE_HALF = TILE_FULL / 2;

export const directionMapping: Tile[] = [];
export const oppositeDirection: Direction[] = [];

directionMapping[Direction.North] = new Tile(0, -1);
directionMapping[Direction.East] = new Tile(1, 0);
directionMapping[Direction.South] = new Tile(0, 1);
directionMapping[Direction.West] = new Tile(-1, 0);

oppositeDirection[Direction.North] = Direction.South;
oppositeDirection[Direction.East] = Direction.West;
oppositeDirection[Direction.South] = Direction.North;
oppositeDirection[Direction.West] = Direction.East;
