import { directionMapping, TILE_FULL } from "../const";
import { Direction } from "../enum";

/**
 * A class that represents a tile, holds tileX and tileY
 */
export default class Tile {
  /**
   *  Constructs a tile based on pixel location and the global TILE_FULL
   * @param {number} x
   * @param {number} y
   * @returns {Tile}
   */
  public static TileFromPixels(x: number, y: number) {
    return new Tile(Math.floor(x / TILE_FULL), Math.floor(y / TILE_FULL));
  }

  public tileX: number;
  public tileY: number;

  /**
   *  Constructs a tile based on tile x and y values
   * @param {number} tileX
   * @param {number} tileY
   */
  constructor(tileX = -1, tileY = -1) {
    this.tileX = tileX;
    this.tileY = tileY;
  }

  /**
   * checks to see if the tile is greater than -1, and less than maxX/maxY
   * @param {number} maxX
   * @param {number} maxY
   * @returns {boolean}
   */
  public isValid(maxX = Infinity, maxY = Infinity) {
    return (this.tileX > -1 && this.tileY > -1 && this.tileX < maxX && this.tileY < maxY);
  }

  /**
   * The top left corner of the tile
   * @returns {{x: number, y: number}}
   */
  public toPixels() {
    return { x: this.tileX * TILE_FULL, y: this.tileY * TILE_FULL };
  }

  /**
   * Compares this tile to another using the given comparator
   * @param {Tile} tile
   * @param {Tile~comparator} comparator
   * @returns {boolean}
   */
  public compare(tile: Tile, comparator: any) {
    return (comparator(this.tileX, tile.tileX) && comparator(this.tileY, tile.tileY));
  }

  /**
   * Subtracts a tile from this one, returns a new tile
   * @param {Tile} tile
   * @returns {Tile}
   */
  public minus(tile: Tile) {
    return new Tile(this.tileX - tile.tileX, this.tileY - tile.tileY);
  }

  /**
   * Adds a tile to this one, returns a new tile.
   * @param {Tile} tile
   * @returns {Tile}
   */
  public add(tile: Tile) {
    return new Tile(this.tileX + tile.tileX, this.tileY + tile.tileY);
  }

  /**
   */
  public copy() {
    return new Tile(this.tileX, this.tileY);
  }

  /**
   * returns the next tile in a given direction
   */
  public nextTile(dir: Direction) {
    return this.add(directionMapping[dir]);
  }

  public toString() {
    return `Tile: (${this.tileX}, ${this.tileY})`;
  }
}
