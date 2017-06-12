/**
 * Represents colors in rgb and can be converted to a string or hex
 */
export default class Color {
    r: number
    g: number
    b: number

    /**
     * Makes a color object
     */
    constructor(r = 0, g = 0, b = 0) {
        this.r = r
        this.g = g
        this.b = b
    }

    /**
     * adds a color to this one and returns the result
     */
    add(color: Color) {
        return new Color(Math.min(this.r + color.r, 255), Math.min(this.g + color.g, 255), Math.min(this.b + color.b, 255))
    }

    /**
     * copies this color
     */
    copy() {
        return new Color(this.r, this.g, this.b)
    }

    equals(otherColor: Color) {
        return this.r === otherColor.r && this.g === otherColor.g && this.b === otherColor.b
    }

    /**
     * returns the rgb string to shove into a ctx.fillstyle or somesuch
     */
    toRGBString() {
        return "rgb(" + this.r + "," + this.g + "," + this.b + ")"
    }

    /**
     * returns the english name of the color
     */
    toName() {
        if (this.r === 0) {
            if (this.g === 0) {
                if (this.b === 0) {
                    return "black"
                }
                return "blue"
            }
            if (this.b === 0) {
                return "green"
            }
            return "cyan"
        }
        if (this.g === 0) {
            if (this.b === 0) {
                return "red"
            }
            return "magenta"
        }
        if (this.b === 0) {
            return "yellow"
        }
        return "white"
    }

    /**
     * Creates a color from the name of the color
     */
    static colorFromName(name: string) {
        switch(name) {
            case "black":
                return new Color(0, 0, 0)
            case "blue":
                return new Color(0, 0, 255)
            case "green":
                return new Color(0, 255, 0)
            case "red":
                return new Color(255, 0, 0)
            case "yellow":
                return new Color(255, 255, 0)
            case "cyan":
                return new Color(0, 255, 255)
            case "magenta":
                return new Color(255, 0, 255)
            case "white":
                return new Color(255, 255, 255)
        }
    }

    static fromJSON(color: any) {
        return new Color(color.r, color.g, color.b)
    }
}