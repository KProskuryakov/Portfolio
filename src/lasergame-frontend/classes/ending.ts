import { End } from '../enum';
import Color from './color';

/**
 * A data point for the paths list holding a color and an ending edge number
 */
export default class Ending {
    end: number|string;
    color: Color;

    /**
     *
     * @param {number|string} end
     * @param {Color} color
     */
    constructor(end: number|string, color: Color) {
        this.end = end;
        this.color = color;
    }

    /**
     * Converts the ending to a string representation
     * @returns {string}
     */
    toString() {
        let string = "";
        string += this.end;
        string += " " + this.color.toName();
        return string;
    }


    static fromJSON(ending: Ending) {
        if (ending.end === "blocked") {
            return new Ending(End.Blocked, Color.fromJSON(ending.color));
        } else if (ending.end === "loop") {
            return new Ending(End.Loop, Color.fromJSON(ending.color));
        } else {
            return new Ending(ending.end, Color.fromJSON(ending.color));
        }
    }

    /**
     *
     * @param {Ending} otherEnding
     * @returns {boolean}
     */
    equals(otherEnding: Ending) {
        return this.end === otherEnding.end && this.color.equals(otherEnding.color);
    }

    /**
     * creates an ending from the logstring
     * @param {string} logString (5 black) or (blocked blue) or (loop white)
     */
    static endingFromLogString(logString: string) {
        let end = Number(logString.slice(0, logString.indexOf(" ")));
        let colorString = logString.slice(logString.indexOf(" ") + 1);
        return new Ending(end, Color.colorFromName(colorString));
    }
}