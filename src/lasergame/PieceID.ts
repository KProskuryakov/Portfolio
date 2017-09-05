import Color, * as colorManager from "./Color";
import Direction from "./Direction";
import LaserSegment, * as laserManager from "./LaserSegment";
import Tile from "./Tile";

enum PieceID {
  FORWARD_SLASH,
  BACK_SLASH,
  BLACK_HOLE,
  WEST_TO_VERT,
  SOUTH_TO_HORI,

  RED,
  BLUE,
  GREEN,

  PLUS,
  MINUS,
}
export default PieceID;

interface PieceRule {
  dirs?: Direction[];
  color?: Color;
}

const pieceRuleList: ReadonlyArray<PieceRule> = [
  { dirs: [Direction.EAST, Direction.NORTH, Direction.WEST, Direction.SOUTH] },
  { dirs: [Direction.WEST, Direction.SOUTH, Direction.EAST, Direction.NORTH] },
  { dirs: [Direction.NONE, Direction.NONE, Direction.NONE, Direction.NONE] },
  { dirs: [Direction.EAST, Direction.NONE, Direction.EAST, Direction.SPLIT_WEST_TO_VERT] },
  { dirs: [Direction.NONE, Direction.NORTH, Direction.SPLIT_SOUTH_TO_HORI, Direction.NORTH] },

  { color: Color.RED },
  { color: Color.BLUE },
  { color: Color.GREEN },
];

export function applyPieceToLaser(laser: LaserSegment, pieceID: PieceID) {
  const pieceRules = pieceRuleList[pieceID];
  if (pieceRules.dirs) {
    laser.dir = pieceRules.dirs[laser.dir];
  }
  if (pieceRules.color) {
    laser.color = colorManager.addColors(laser.color, pieceRules.color);
  }
}
