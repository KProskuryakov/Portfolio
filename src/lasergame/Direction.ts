enum Direction {
  NORTH,
  EAST,
  SOUTH,
  WEST,
  NONE,
  SPLIT_EAST_WEST,
  SPLIT_NORTH_SOUTH,
}
export default Direction;

const oppositeDirection = [Direction.SOUTH, Direction.WEST, Direction.NORTH, Direction.EAST];

export function getOppositeDirection(dir: Direction) {
  if (dir > Direction.WEST) {
    throw new Error(`Direction #getOppositeDirection called with ${Direction[dir]} which is invalid.`);
  }
  return oppositeDirection[dir];
}
