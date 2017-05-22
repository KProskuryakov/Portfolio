import Tile from './tile';

/**
 * A superclass that exposes a basic drawing function for mirrors and swatches
 */
export default class Piece {
    tile: Tile;

    /**
     * Constructs a single piece with the given image src
     */
    constructor() {
        this.tile = new Tile(-1, -1);
    }
}