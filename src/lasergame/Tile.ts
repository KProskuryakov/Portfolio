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
      return { x: 0, y: 0 };
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
  return { x: a.x - b.x, y: a.y - b.y };
}

export function copyTile(tile: Tile): Tile {
  return { x: tile.x, y: tile.y };
}

export function tileNotNegative(tile: Tile) {
  return tileCompare(tile, { x: -1, y: -1 }, (a, b) => a > b);
}

export function tileCompare(a: Tile, b: Tile, compare: (a: number, b: number) => boolean) {
  return compare(a.x, b.x) && compare(a.y , b.y);
}

export function tileWithinAreaInclusive(tile: Tile, min: Tile, max: Tile) {
  return tileCompare(tile, min, (a, b) => a >= b) && tileCompare(tile, max, (a, b) => a <= b);
}

export function tileWithinAreaExclusive(tile: Tile, min: Tile, max: Tile) {
  return tileCompare(tile, min, (a, b) => a > b) && tileCompare(tile, max, (a, b) => a < b);
}
