import Ending, {endingsEqual} from "./Ending";

export default interface Path {
  start: number;
  endings: Ending[];
}

export function equalPaths(a: Path, b: Path) {
  if (a.endings.length !== b.endings.length) return false;
  for (let i = 0; i < a.endings.length; i++) {
    if (!endingsEqual(a.endings[i], b.endings[i])) {
      return false;
    }
  }
  return true;
}
