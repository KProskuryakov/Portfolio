import Color from "lasergame/color";
import Piece from "lasergame/piece";

/**
 * Swatches represent pieces on the board that can change a laser's color
 */
export default class Swatch extends Piece {
    public color: Color;

    constructor(color: Color) {
        super();
        this.color = color;
    }
}
