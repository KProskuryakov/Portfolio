import Direction from "./Direction";

export const TILE_FULL = 50;
export const TILE_HALF = TILE_FULL / 2;
export const oppositeDirection: Direction[] = [];

oppositeDirection[Direction.North] = Direction.South;
oppositeDirection[Direction.East] = Direction.West;
oppositeDirection[Direction.South] = Direction.North;
oppositeDirection[Direction.West] = Direction.East;
