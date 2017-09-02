enum Color {
  BLACK,
  BLUE,
  GREEN,
  CYAN,
  RED,
  MAGENTA,
  YELLOW,
  WHITE,
}
export default Color;

export function addColors(a: Color, b: Color) {
  return a | b;
}

export function colorToRGBString(color: Color) {
  const r = 4 === (4 & color) ? 255 : 0;
  const g = 2 === (2 & color) ? 255 : 0;
  const b = 1 === (1 & color) ? 255 : 0;
  return `rgb(${r},${g},${b})`;
}

export function colorToName(color: Color) {
  return Color[color];
}
