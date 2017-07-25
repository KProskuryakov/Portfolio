import { TILE_FULL } from "../const";
import { pieceComponents } from "../lasergame";
import CanvasComponent from "./canvas_component";
import Tile from "./tile";

/**
 * The toolbar to select the pieces to put in the grid
 */
export default class ToolbarComponent extends CanvasComponent {
  public selectedPiece: number;

  /**
   *
   * @param {string} src
   * @param {Tile} tile
   * @param {number} widthInTiles
   * @param {number} heightInTiles
   * @param {number} [offsetX = 0] pixel offset for the image
   * @param {number} [offsetY = 0] pixel offset for the image
   */
  constructor(src: string, tile: Tile, widthInTiles: number, heightInTiles: number,
              draw: () => void, offsetX = 0, offsetY = 0) {
    super(src, tile, widthInTiles, heightInTiles, draw, offsetX, offsetY);
    this.selectedPiece = 0;
  }

  /**
   * draws the image, the pieces and the highlight
   */
  public draw(ctx: CanvasRenderingContext2D) {
    super.draw(ctx);

    // draw pieces in each box
    for (let i = 0; i < pieceComponents.length; i++) {
      pieceComponents[i].drawAt(this.tile.add(new Tile(i, 0)), ctx);
    }

    // draw the green highlight
    ctx.fillStyle = "green";
    ctx.globalAlpha = 0.2;
    let loc = new Tile(this.tile.add(new Tile(this.selectedPiece, 0)).tileX, this.tile.tileY).toPixels();
    ctx.fillRect(loc.x, loc.y, TILE_FULL, TILE_FULL);
    ctx.globalAlpha = 1;

    // draw the red highlight
    ctx.fillStyle = "red";
    ctx.globalAlpha = 0.2;
    for (let i = 0; i < pieceComponents.length; i++) {
      const piece = pieceComponents[i].piece;
      if (i !== this.selectedPiece && piece.tile.isValid()) {
        loc = new Tile(this.tile.add(new Tile(i, 0)).tileX, this.tile.tileY).toPixels();
        ctx.fillRect(loc.x, loc.y, TILE_FULL, TILE_FULL);
      }
    }
    ctx.globalAlpha = 1.0;
  }

  /**
   * Selects a piece if clicked on.
   * @param {number} x a pixel x value
   * @param {number} y a pixel y value
   */
  public processMouseClick(x: number, y: number) {
    const relativeTile = super.processMouseClick(x, y);
    if (relativeTile !== null) {
      this.selectedPiece = relativeTile.tileX;
    }
    return relativeTile;
  }

  /**
   * Fetches the selected piece object.
   * @returns {Piece}
   */
  public getSelectedPieceComponent() {
    return pieceComponents[this.selectedPiece];
  }
}
