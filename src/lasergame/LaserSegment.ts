import Color from "./Color";
import Direction, { getOppositeDirection } from "./Direction";
import Tile, { copyTile } from "./Tile";

export default interface LaserSegment {
  tile: Tile;
  dir: Direction;
  color: Color;
}

export function getOppositeLaserSegment(laser: LaserSegment): LaserSegment {
  return { tile: copyTile(laser.tile), dir: getOppositeDirection(laser.dir), color: laser.color };
}

export function copyLaserSegment(laser: LaserSegment): LaserSegment {
  return { tile: copyTile(laser.tile), dir: laser.dir, color: laser.color };
}
