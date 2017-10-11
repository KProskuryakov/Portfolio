type DirectionName = "NORTH" | "EAST" | "SOUTH" | "WEST" | "NONE";
enum DirectionEnum { NORTH = -2, EAST, NONE, WEST, SOUTH }

class Direction {
  public static getInstance(name: DirectionName, y: number) {
    if (!Direction.directionArray[DirectionEnum[name]]) {
      Direction.directionArray[DirectionEnum[name]] = new Direction(name);
    }
    return Direction.directionArray[DirectionEnum[name]];
  }

  private static readonly directionArray: Direction[] = [];

  private readonly x: number;
  private readonly y: number;
  private constructor(private readonly name: DirectionName) {
    
  }
}

const oppositeDirection = [Direction.SOUTH, Direction.WEST, Direction.NORTH, Direction.EAST];

export function getOppositeDirection(dir: Direction) {
  if (dir > Direction.WEST) {
    throw new Error(`Direction #getOppositeDirection called with ${Direction[dir]} which is invalid.`);
  }
  return oppositeDirection[dir];
}
