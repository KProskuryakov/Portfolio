import { End } from "../enum";
import Color from "./color";

/**
 * A data point for the paths list holding a color and an ending edge number
 */
export default class Ending {
  public static fromJSON(ending: Ending) {
    if (ending.end === End.Blocked) {
      return new Ending(End.Blocked, Color.fromJSON(ending.color));
    } else if (ending.end === End.Loop) {
      return new Ending(End.Loop, Color.fromJSON(ending.color));
    } else {
      return new Ending(ending.end, Color.fromJSON(ending.color));
    }
  }

  /**
   * creates an ending from the logstring
   * @param {string} logString (5 black) or (blocked blue) or (loop white)
   */
  public static endingFromLogString(logString: string) {
    const end = Number(logString.slice(0, logString.indexOf(" ")));
    const colorString = logString.slice(logString.indexOf(" ") + 1);
    return new Ending(end, Color.colorFromName(colorString));
  }

  public end: number;
  public color: Color;

  /**
   *
   * @param {number|string} end
   * @param {Color} color
   */
  constructor(end: number, color: Color) {
    this.end = end;
    this.color = color;
  }

  /**
   * Converts the ending to a string representation
   * @returns {string}
   */
  public toString() {
    let str = "";
    if (this.end === -2) {
      str += "blocked";
    } else if (this.end === -1) {
      str += "loop";
    } else {
      str += this.end;
    }
    str += " " + this.color.toName();
    return str;
  }

  /**
   *
   * @param {Ending} otherEnding
   * @returns {boolean}
   */
  public equals(otherEnding: Ending) {
    return this.end === otherEnding.end && this.color.equals(otherEnding.color);
  }
}
