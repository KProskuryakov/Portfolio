import Tile from './tile';

/**
 * A superclass that exposes a basic drawing function for mirrors and swatches
 */
export default class Piece {
    tile: Tile;
    img: HTMLImageElement;

    /**
     * Constructs a single piece with the given image src
     */
    constructor(src: string, draw: () => void, ) {
        this.tile = new Tile(-1, -1);
        this.img = new Image();
        this.img.onload = () => {draw()};
        this.img.src = src;
    }


    /**
     * Draws the piece's img at a given tile location
     */
    drawAt(tile: Tile, ctx: CanvasRenderingContext2D) {
        let pos = tile.toPixels();
        ctx.drawImage(this.img, pos.x, pos.y);
    }
}