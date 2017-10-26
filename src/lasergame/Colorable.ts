import Color from "./Color";

export default interface Colorable {
    applyColor(color: Color): void;
}