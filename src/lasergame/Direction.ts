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
  const oppDir = oppositeDirection[dir];
  return oppDir === undefined ? Direction.NONE : oppDir;
}
