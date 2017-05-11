import Laser from "./laser";
import { TILE_HALF, directionMapping, toolbar, logCurrentPaths, logImportPaths, pieces, Direction, End, PathsList } from './lasergame';
import CanvasComponent from './canvas_component';
import Piece from './piece';
import Tile from './tile';
import Mirror from './mirror'
import Swatch from './swatch';
import Ending from './ending';

/**
 * The laser grid in the top left
 */
export default class LaserGrid extends CanvasComponent {
    grid: Piece[][];
    selectedEdge: number;
    paths: Array<Ending[]>;
    drawPath: Array<Laser>;
    importedPathsList: PathsList;

    /**
     *
     * @param {string} src
     * @param {Tile} tile
     * @param {number} widthInTiles
     * @param {number} heightInTiles
     * @param {number} [offsetX = 0] pixel offset for the image
     * @param {number} [offsetY = 0] pixel offset for the image
     */
    constructor(src: string, tile: Tile, widthInTiles: number, heightInTiles: number, draw: () => void, offsetX = 0, offsetY = 0) {
        super(src, tile, widthInTiles, heightInTiles, draw, offsetX, offsetY);

        this.grid = [];
        for (let i = 0; i < 5; i++) {
            this.grid[i] = [];
            for (let j = 0; j < 5; j++) {
                this.grid[i][j] = null;
            }
        }

        this.selectedEdge = 1;

        /**
         *
         * @type {Array.<Array.<Ending>>}
         */
        this.paths = [];
        /**
         *
         * @type {Array.<Laser>}
         */
        this.drawPath = [];

        this.importedPathsList = [];
    }

    /**
     * Draws the image and the pieces on the grid
     */
    draw(ctx: CanvasRenderingContext2D) {
        super.draw(ctx);

        for (let i = 0; i < pieces.length; i++) {
            let piece = pieces[i];
            if (piece.tile.isValid()) {
                piece.drawAt(this.tile.add(piece.tile).add(new Tile(1, 1)), ctx);
            }
        }

        for (let i = 0; i < this.drawPath.length; i++) {
            ctx.beginPath();
            let laser = this.drawPath[i];
            ctx.strokeStyle = laser.color.toRGBString();
            let loc = laser.tile.add(new Tile(1, 1)).toPixels();
            loc.x += TILE_HALF;
            loc.y += TILE_HALF;
            ctx.moveTo(loc.x, loc.y);
            let tilemap = directionMapping[laser.dir];
            ctx.lineTo(loc.x + tilemap.tileX * TILE_HALF, loc.y + tilemap.tileY * TILE_HALF);
            ctx.stroke();
        }
    }

    /**
     * Process mouse clicks on the grid
     * @param {number} x
     * @param {number} y
     * @param {Toolbar} toolbar
     */
    processMouseClick(x: number, y: number) {
        let relativeTile = super.processMouseClick(x, y);
        if (relativeTile !== null) {
            if (relativeTile.compare(new Tile(1, 1), (v1: number, v2: number) => v1 >= v2) && relativeTile.compare(new Tile(5, 5), (v1: number, v2: number) => v1 <= v2)) {
                let loc = relativeTile.minus(new Tile(1, 1));
                let piece = this.grid[loc.tileY][loc.tileX];
                if (piece !== null) {
                    this.removePiece(piece);
                } else {
                    this.setPiece(toolbar.getSelectedPiece(), loc);
                }
                this.calculateAllPaths();
                this.calculateDrawPathWrapper();
            }
            let newEdge = LaserGrid.tileToEdgeNumber(relativeTile.add(new Tile(-1, -1)));
            if (newEdge !== 0) {
                this.selectedEdge = newEdge;
            }
            this.calculateDrawPathWrapper();
        }
        return relativeTile;
    }

    /**
     * Removes a piece from the grid and resets the pieces tile
     * @param {Piece} piece
     */
    removePiece(piece: Piece) {
        if (piece.tile.isValid()) {
            this.grid[piece.tile.tileY][piece.tile.tileX] = null;
            piece.tile = new Tile(-1, -1);
        }
    }

    /**
     * Adds the piece to the grid, and removes it from anywhere else it was on the grid.
     * @param piece the selected piece
     * @param {Tile} tile the tile on the grid to put the piece in
     */
    setPiece(piece: Piece, tile: Tile) {
        this.removePiece(piece);
        this.grid[tile.tileY][tile.tileX] = piece;
        piece.tile = tile;
    }

    /**
     * @param {Tile} tile
     * @return {?Piece}
     */
    getPiece(tile: Tile) {
        return this.grid[tile.tileY][tile.tileX];
    }

    /**
     * Populates the paths array with a bunch of paths
     */
    calculateAllPaths() {
        this.paths = [];
        for (let edge = 1; edge <= 20; edge++) {
            this.calculatePath(edge, LaserGrid.edgeNumberToLaser(edge));
        }
        logCurrentPaths();
        if (this.importedPathsList.length > 0) {
            logImportPaths();
        }
    }

    /**
     */
    calculatePath(edge: number, laser: Laser) {
        for (let i = 0; i < 100; i++) {
            laser.tile = laser.tile.nextTile(laser.dir);
            if (!laser.tile.isValid(5, 5)) {
                let endEdge = LaserGrid.tileToEdgeNumber(laser.tile);
                this.addEndingToPaths(edge, new Ending(endEdge, laser.color));
                return;
            }
            let piece = this.getPiece(laser.tile);
            if (piece) {
                if (piece instanceof Mirror) {
                    laser.dir = piece.dirs[laser.dir];
                    switch (laser.dir) {
                        case Direction.SplitNorthSouth:
                            laser.dir = Direction.North;
                            this.calculatePath(edge, new Laser(laser.tile, Direction.South, laser.color));
                            break;
                        case Direction.SplitEastWest:
                            laser.dir = Direction.East;
                            this.calculatePath(edge, new Laser(laser.tile, Direction.West, laser.color));
                            break;
                        case Direction.None:
                            this.addEndingToPaths(edge, new Ending(End.Blocked, laser.color));
                            return;
                    }
                } else if (piece instanceof Swatch) {
                    laser.color = laser.color.add(piece.color);
                }
            } // if piece is not null
        } // for
        this.addEndingToPaths(edge, new Ending(End.Loop, laser.color));
    }

    /**
     * Calculates the drawpath from the selected edge
     */
    calculateDrawPathWrapper() {
        this.drawPath = [];
        this.calculateDrawPath(LaserGrid.edgeNumberToLaser(this.selectedEdge));
    }

    /**
     *
     */
    calculateDrawPath(laser: Laser) {
        for (let i = 0; i < 100; i++) {
            laser.tile = laser.tile.nextTile(laser.dir);
            if (!laser.tile.isValid(5, 5)) {
                return;
            }
            let piece = this.getPiece(laser.tile);
            this.drawPath.push(laser.getOppositeLaser());
            if (piece) {
                if (piece instanceof Mirror) {
                    laser.dir = piece.dirs[laser.dir];
                    switch (laser.dir) {
                        case Direction.SplitNorthSouth:
                            laser.dir = Direction.North;
                            this.drawPath.push(laser.getOppositeLaser());
                            this.calculateDrawPath(new Laser(laser.tile, Direction.South, laser.color));
                            break;
                        case Direction.SplitEastWest:
                            laser.dir = Direction.East;
                            this.drawPath.push(laser.getOppositeLaser());
                            this.calculateDrawPath(new Laser(laser.tile, Direction.West, laser.color));
                            break;
                        case Direction.None:
                            return;
                    }
                } else if (piece instanceof Swatch) {
                    laser.color = laser.color.add(piece.color);
                }
            } // if piece is not null
            this.drawPath.push(laser.copy());
        }
    }

    /**
     */
    addEndingToPaths(edge: number, ending: Ending) {
        if (!this.paths[edge]) {
            this.paths[edge] = []
        }
        this.paths[edge].push(ending);
    }

    /**
     * Returns a laser with the given properties based on the edge it originated from
     */
    static edgeNumberToLaser(edge: number) {
        if (edge < 6) {
            return new Laser(new Tile(edge - 1, -1), Direction.South);
        } else if (edge < 11) {
            return new Laser(new Tile(5, edge - 6), Direction.West);
        } else if (edge < 16) {
            return new Laser(new Tile(-edge + 15, 5), Direction.North);
        } else if (edge < 21) {
            return new Laser(new Tile(-1, -edge + 20), Direction.East);
        }
    }

    /**
     */
    static tileToEdgeNumber(tile: Tile) {
        let x = tile.tileX;
        let y = tile.tileY;
        if (y === -1 && x > -1 && x < 5) {
            return 1 + x;
        } else if (x === 5 && y > -1 && y < 5) {
            return 6 + y;
        } else if (y === 5 && x > -1 && x < 5) {
            return 15 - x;
        } else if (x === -1 && y > -1 && y < 5) {
            return 20 - y;
        }
        return 0;
    }

}
