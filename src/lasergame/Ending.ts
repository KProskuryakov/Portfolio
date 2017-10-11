import Color from "./Color";

export default interface Ending {
  readonly end: End;
  readonly color: Color;
}

export enum End {
  Blocked = -2,
  Loop,
}

export function endingsEqual(a: Ending, b: Ending) {
  return a.end === b.end && a.color === b.color;
}
