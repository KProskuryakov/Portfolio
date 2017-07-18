import Piece from "./piece";
import Tile from "./tile";

export default class PieceComponent {
  public piece: Piece;
  private img: HTMLImageElement;

  constructor(piece: Piece, src: string, draw: () => void) {
    this.piece = piece;
    this.img = new Image();
    this.img.onload = () => { draw(); };
    this.img.src = src;
  }

  public drawAt(tile: Tile, ctx: CanvasRenderingContext2D) {
    const pos = tile.toPixels();
    ctx.drawImage(this.img, pos.x, pos.y);
  }
}
