import Laser from "./Laser";

export default abstract class Piece {
    private _x = -1;
    private _y = -1;
    
    public abstract apply(laser: Laser): Laser[];

    public get x() {
        return this._x;
    }

    public get y() {
        return this._y;
    }

    public move(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    public reset() {
        this._x = -1;
        this._y = -1;
    }

    public valid() {
        return this._x !== -1 && this._y !== -1
    }
}