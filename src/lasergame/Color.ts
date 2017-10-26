import Colorable from "./Colorable";

type ColorName = "BLACK" | "BLUE" | "GREEN" | "CYAN" | "RED" | "MAGENTA" | "YELLOW" | "WHITE";
enum ColorEnum { BLACK, BLUE, GREEN, CYAN, RED, MAGENTA, YELLOW, WHITE }

export default class Color {
  public static getInstance(name: ColorName | ColorEnum = "BLACK"): Color {
    if (typeof name === "string") {
      name = ColorEnum[name];
    }
    if (name < ColorEnum.BLACK || name > ColorEnum.WHITE) {
      name = ColorEnum.BLACK;
    }
    if (!Color.colorArray[name]) {
      Color.colorArray[name] = new Color(name);
    }
    return Color.colorArray[name];
  }

  private static readonly colorArray: Color[] = [];

  private constructor(private readonly value: ColorEnum) {}

  public add(other: Color) {
    return Color.getInstance(ColorEnum[this.value | other.value] as ColorName);
  }

  public applyColor(laser: Colorable) {
    laser.applyColor(this);
  }

  public getName() {
    return ColorEnum[this.value];
  }

  public toRGBString() {
    const r = 4 === (4 & this.value) ? 255 : 0;
    const g = 2 === (2 & this.value) ? 255 : 0;
    const b = 1 === (1 & this.value) ? 255 : 0;
    return `rgb(${r},${g},${b})`;
  }
}
