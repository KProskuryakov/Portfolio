import Direction from "./Direction";
import Color from "./Color";

export default class Laser {
  public constructor(
    private _x: number,
    private _y: number,
    private _dir: Direction,
    private _color: Color = Color.getInstance(),
    private _size: number,
  ) {}

  public copy() {
    return new Laser(this.)
  }
}
