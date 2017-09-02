import Tile, {subTiles, tileWithinAreaExclusive} from "../../Tile";
import { tileFromPixels, tileToPixels } from "../FrontendTile";

/**
 * An abstract class representing a smaller section of the canvas
 */
export default class CanvasComponent {
  public tile: Tile;
  public widthInTiles: number;
  public heightInTiles: number;
  public offsetX: number;
  public offsetY: number;
  private img: HTMLImageElement;

  constructor(src: string, tile: Tile, widthInTiles: number, heightInTiles: number, draw: () => void,
              offsetX = 0, offsetY = 0) {
    this.img = new Image();
    this.img.onload = () => { draw(); };
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
  public draw(ctx: CanvasRenderingContext2D) {
    const loc = tileToPixels(this.tile);
    ctx.drawImage(this.img, loc.px + this.offsetX, loc.py + this.offsetY);
  }

  /**
   * Figures out whether a button press happened inside the component and returns it. If it didn't, returns null.
   */
  public processMouseClick(x: number, y: number) {
    const relativeTile = subTiles(tileFromPixels(x, y), this.tile);
    if (tileWithinAreaExclusive(relativeTile, {x: -1, y: -1}, {x: this.widthInTiles, y: this.heightInTiles})) {
      return relativeTile;
    }
    return null;
  }
}
