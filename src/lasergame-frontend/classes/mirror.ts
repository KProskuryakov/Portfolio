import Piece from './grid_piece';
import { Direction } from '../enum';

/**
 * Mirrors represent pieces on the board that can change a laser's direction or split it/nullify it.
 */
export default class Mirror extends Piece {
    dirs: Direction[];

    /**
     * Creates a mirror out of this stuff
     */
    constructor(src: string, north: Direction, east: Direction, south: Direction, west: Direction, draw: () => void) {
        super(src, draw);
        this.dirs = [];
        this.dirs[Direction.North] = north;
        this.dirs[Direction.East] = east;
        this.dirs[Direction.South] = south;
        this.dirs[Direction.West] = west;
    }
}