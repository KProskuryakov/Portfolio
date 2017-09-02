import Tile, { addTiles, tileNotNegative } from "../../Tile";
import { availablePieces, pieceComponents } from "../FrontendLasergame";
import { TILE_FULL, tileToPixels } from "../FrontendTile";
import CanvasComponent from "./CanvasComponent";

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
  constructor(
    src: string, tile: Tile, widthInTiles: number, heightInTiles: number,
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
    for (let i = 0; i < availablePieces.length; i++) {
      pieceComponents[availablePieces[i].pieceID].drawAt(addTiles(this.tile, {x: i, y: 0}), ctx);
    }

    // draw the green and red highlights
    ctx.fillStyle = "green";
    ctx.globalAlpha = 0.2;
    let loc = tileToPixels(addTiles(this.tile, {x: this.selectedPiece, y: 0}));
    ctx.fillRect(loc.px, loc.py, TILE_FULL, TILE_FULL);

    ctx.fillStyle = "red";
    for (let i = 0; i < availablePieces.length; i++) {
      const piece = availablePieces[i];
      if (i !== this.selectedPiece && tileNotNegative(piece.tile)) {
        loc = tileToPixels(addTiles(this.tile, {x: i, y: 0}));
        ctx.fillRect(loc.px, loc.py, TILE_FULL, TILE_FULL);
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
      this.selectedPiece = relativeTile.x;
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
