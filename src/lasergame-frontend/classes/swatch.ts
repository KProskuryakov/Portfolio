import Piece from './grid_piece';
import Color from './color';

/**
 * Swatches represent pieces on the board that can change a laser's color
 */
export default class Swatch extends Piece {
    color: Color;

    /**
     *
     */
    constructor(src: string, color: Color, draw: () => void) {
        super(src, draw);
        this.color = color;
    }
}