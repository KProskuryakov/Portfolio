import {colorToName} from "../Color";
import Ending, {End} from "../Ending";

export function endingToString(ending: Ending) {
  const colorString = colorToName(ending.color);
  return ending.end === End.Blocked ? `blocked ${colorString}` :
    ending.end === End.Loop ? `loop ${colorString}` :
    `${ending.end} ${colorString}`;
}
