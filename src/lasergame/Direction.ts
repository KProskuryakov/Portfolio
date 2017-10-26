type DirectionName = "NORTH" | "EAST" | "SOUTH" | "WEST" | "NONE";

export default abstract class Direction {

  protected constructor(private readonly _name: DirectionName, private readonly _x: number, private readonly _y: number) {}

  public abstract opposite(): Direction;

  public get x() {
    return this._x;
  }

  public get y() {
    return this._y;
  }

  public get name() {
    return this._name;
  }
}
