import Laser from "../Laser";

export default abstract class Piece {
  constructor(private x: number, private y: number) {}

  public abstract apply(laser: Laser): Laser[];
}
