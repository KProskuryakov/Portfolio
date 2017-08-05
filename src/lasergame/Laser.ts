import Color from "./Color";
import { oppositeDirection } from "./Const";
import Direction from "./Direction";
import Tile from "./Tile";

/**
 * A representation of the location/direction/color of the laser  in a specific tile
 */
export default class Laser {
  public tile: Tile;
  public dir: Direction;
  public color: Color;

  /**
   * Constructs a Laser
   * @param {Tile} tile
   * @param {string} dir
   * @param {Color} color
   */
  constructor(tile: Tile, dir: Direction, color = new Color()) {
    this.tile = tile;
    this.dir = dir;
    this.color = color;
  }

  /**
   * creates a laser with the opposite direction
   * @returns {Laser}
   */
  public getOppositeLaser() {
    return new Laser(this.tile.copy(), oppositeDirection[this.dir], this.color.copy());
  }

  /**
   *
   * @returns {Laser}
   */
  public copy() {
    return new Laser(this.tile.copy(), this.dir, this.color.copy());
  }
}
