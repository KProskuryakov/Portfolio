import Piece from "./Piece"

export default class Grid {
    public constructor(
        private readonly _pieces: Piece[] = [],
        private _grid: Piece[] = [],
        private readonly _width = 5,
        private readonly _height = 5,
    ) {}

    public reset() {
        for (let p of this._pieces) {
            p.reset();
        }
        this._grid = [];
    }

    public set(index: number, x: number, y: number) {
        if (index < 0 || index > this._pieces.length) {
            throw new Error("");
        }
        if (x < 0 || x >= this._width) {
            throw new Error("");
        }
        if (y < 0 || y >= this._height) {
            throw new Error("");
        }
        this._pieces[index].move(x, y);
        this._grid[x + y * this._width] = this._pieces[index];
    }

    public get pieces() {
        return this._pieces;
    }

    public get width() {
        return this._width;
    }

    public get height() {
        return this._height;
    }


    public paths() {
        
    }
}
