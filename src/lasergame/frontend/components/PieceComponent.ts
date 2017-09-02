import { GridPiece } from "../../LaserGrid";
import PieceID from "../../PieceID";
import Tile from "../../Tile";
import { tileToPixels } from "../FrontendTile";

export default class PieceComponent {
  public piece: GridPiece;
  public isPlaced: boolean;
  private img: HTMLImageElement;

  constructor(pieceID: PieceID, src: string, draw: () => void) {
    this.piece = { pieceID, tile: { x: -1, y: -1 } };
    this.isPlaced = false;
    this.img = new Image();
    this.img.onload = () => { draw(); };
    this.img.src = src;
  }

  public drawAt(tile: Tile, ctx: CanvasRenderingContext2D) {
    const pos = tileToPixels(tile);
    ctx.drawImage(this.img, pos.px, pos.py);
  }
}
