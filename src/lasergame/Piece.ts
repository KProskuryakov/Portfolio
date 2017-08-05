import Tile from "./Tile";

/**
 * A superclass that exposes a basic drawing function for mirrors and swatches
 */
export default class Piece {
  public tile: Tile;

  /**
   * Constructs a single piece with the given image src
   */
  constructor() {
    this.tile = new Tile(-1, -1);
  }
}
