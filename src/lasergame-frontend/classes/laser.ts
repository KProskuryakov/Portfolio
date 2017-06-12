import { oppositeDirection } from '../const'
import { Direction } from '../enum'
import Tile from './tile'
import Color from './color'


/**
 * A representation of the location/direction/color of the laser  in a specific tile
 */
export default class Laser {
    tile: Tile
    dir: Direction
    color: Color

    /**
     * Constructs a Laser
     * @param {Tile} tile
     * @param {string} dir
     * @param {Color} color
     */
    constructor(tile: Tile, dir: Direction, color = new Color()) {
        this.tile = tile
        this.dir = dir
        this.color = color
    }

    /**
     * creates a laser with the opposite direction
     * @returns {Laser}
     */
    getOppositeLaser() {
        return new Laser(this.tile.copy(), oppositeDirection[this.dir], this.color.copy())
    }

    /**
     *
     * @returns {Laser}
     */
    copy() {
        return new Laser(this.tile.copy(), this.dir, this.color.copy())
    }
}