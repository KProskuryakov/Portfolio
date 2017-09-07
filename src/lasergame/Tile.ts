import Direction from "./Direction";

export default interface Tile {
  x: number;
  y: number;
}

export function directionToTile(direction: Direction): Tile {
  switch (direction) {
    case Direction.NORTH:
      return { x: 0, y: -1 };
    case Direction.EAST:
      return { x: 1, y: 0 };
    case Direction.SOUTH:
      return { x: 0, y: 1 };
    case Direction.WEST:
      return { x: -1, y: 0 };
    default:
      throw new Error(`Tile #directionToTile invalid direction ${direction}`);
  }
}

export function nextTile(tile: Tile, dir: Direction) {
  return addTiles(tile, directionToTile(dir));
}

export function addTiles(...tiles: Tile[]): Tile {
  return tiles.reduce((p, v, i) => {
    return {x: p.x + v.x, y: p.y + v.y};
  }, {x: 0, y: 0} );
}

export function subTiles(a: Tile, b: Tile): Tile {
  return addTiles(a, negTile(b));
}

export function negTile(tile: Tile): Tile {
  return { x: -tile.x, y: -tile.y };
}

export function copyTile(tile: Tile): Tile {
  return { x: tile.x, y: tile.y };
}

export function tileNotNegative(tile: Tile) {
  return tile.x > -1 && tile.y > -1;
}

export function tileWithinAreaInclusive(tile: Tile, min: Tile, max: Tile) {
  return tile.x >= min.x && tile.y >= min.y && tile.x <= max.x && tile.y <= max.y;
}

export function tileWithinAreaExclusive(tile: Tile, min: Tile, max: Tile) {
  return tile.x > min.x && tile.y > min.y && tile.x < max.x && tile.y < max.y;
}
