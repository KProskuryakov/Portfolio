import Path from "../Path";
import {endingToString} from "./FrontendEnding";

export function pathToString(path: Path) {
  return startToString(path) + endingListToString(path);
}

export function startToString(path: Path) {
  let str = `${path.start}`;
  if (path.start < 10) {
    str += "  -> ";
  } else {
    str += " -> ";
  }
  return str;
}

export function endingListToString(path: Path) {
  if (path.endings.length > 1) {
    let str = `{${endingToString(path.endings[0])}, `;
    for (let curEnding = 1; curEnding < path.endings.length - 1; curEnding++) {
      str += `${endingToString(path.endings[curEnding])}, `;
    }
    str += `${endingToString(path.endings[path.endings.length - 1])}}`;
    return str;
  }
  return endingToString(path.endings[0]);
}
