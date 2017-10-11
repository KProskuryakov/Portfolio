import Color from "../Color";
import Ending, {End} from "../Ending";

export function endingToString(ending: Ending) {
  const colorString = Color[ending.color];
  return ending.end === End.Blocked ? `blocked ${colorString}` :
    ending.end === End.Loop ? `loop ${colorString}` :
    `${ending.end} ${colorString}`;
}
