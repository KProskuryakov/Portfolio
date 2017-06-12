import Piece from './piece'
import Color from './color'

/**
 * Swatches represent pieces on the board that can change a laser's color
 */
export default class Swatch extends Piece {
    color: Color

    constructor(color: Color) {
        super()
        this.color = color
    }
}