import Tile from './tile';

/**
 * An abstract class representing a smaller section of the canvas
 */
export default class CanvasComponent {
    img: HTMLImageElement;
    tile: Tile;
    widthInTiles: number;
    heightInTiles:number;
    offsetX: number;
    offsetY: number

    /**
     *
     */
    constructor(src: string, tile: Tile, widthInTiles: number, heightInTiles: number, offsetX = 0, offsetY = 0, draw: any) {
        this.img = new Image();
        this.img.onload = () => {draw()};
        this.img.src = src;
        this.tile = tile;
        this.widthInTiles = widthInTiles;
        this.heightInTiles = heightInTiles;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
    }

    /**
     * Draws the components image at the location
     */
    draw(ctx: CanvasRenderingContext2D) {
        let loc = this.tile.toPixels();
        ctx.drawImage(this.img, loc.x + this.offsetX, loc.y + this.offsetY);
    }

    /**
     * Figures out whether a button press happened inside the component and returns it. If it didn't, returns null.
     */
    processMouseClick(x: number, y: number) {
        let relativeTile = Tile.TileFromPixels(x, y).minus(this.tile);
        if (relativeTile.isValid(this.widthInTiles, this.heightInTiles)) {
            return relativeTile;
        }
        return null;
    }
}