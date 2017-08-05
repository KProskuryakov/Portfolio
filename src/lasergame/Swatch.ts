import Color from "./Color";
import Piece from "./Piece";

/**
 * Swatches represent pieces on the board that can change a laser's color
 */
class Swatch extends Piece {
    public color: Color;

    constructor(color: Color) {
        super();
        this.color = color;
    }
}

export default Swatch;
