import Tile from "../Tile";

export const TILE_FULL = 50;
export const TILE_HALF = TILE_FULL / 2;

export function tileFromPixels(x: number, y: number): Tile {
  return {x: Math.floor(x / TILE_FULL), y: Math.floor(y / TILE_FULL)};
}

export function tileToPixels(tile: Tile) {
  return { px: tile.x * TILE_FULL, py: tile.y * TILE_FULL };
}
