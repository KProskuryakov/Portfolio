import Direction from "./Direction";
import Piece from "./Piece";

/**
 * Mirrors represent pieces on the board that can change a laser's direction or split it/nullify it.
 */
export default class Mirror extends Piece {
    public dirs: Direction[];

    /**
     * Creates a mirror out of this stuff
     */
    constructor(north: Direction, east: Direction, south: Direction, west: Direction) {
        super();
        this.dirs = [];
        this.dirs[Direction.North] = north;
        this.dirs[Direction.East] = east;
        this.dirs[Direction.South] = south;
        this.dirs[Direction.West] = west;
    }
}