import Ending from "./ending";

export default class Path {
  public static fromJSONObject(json: Path) {
    const endingsList: Ending[] = [];
    for (const ending of json.endings) {
      endingsList.push(Ending.fromJSON(ending));
    }
    return new Path(json.start, endingsList);
  }

  public start: number;
  public endings: Ending[];

  constructor(start: number, endings: Ending[]) {
    this.start = start;
    this.endings = endings;
  }

  public toString() {
    return this.startToString() + this.endingListToString();
  }

  public startToString() {
    let str = `${this.start}`;
    if (this.start < 10) {
      str += "  -> ";
    } else {
      str += " -> ";
    }
    return str;
  }

  public endingListToString() {
    if (this.endings.length > 1) {
      let str = `{${this.endings[0].toString()}, `;
      for (let curEnding = 1; curEnding < this.endings.length - 1; curEnding++) {
        str += `${this.endings[curEnding].toString()}, `;
      }
      str += `${this.endings[this.endings.length - 1].toString()}}`;
      return str;
    }
    return this.endings[0].toString();
  }

  public endingsEqual(otherPath: Path) {
    if (this.endings.length === otherPath.endings.length) {
      for (let i = 0; i < this.endings.length; i++) {
        if (!this.endings[i].equals(otherPath.endings[i])) {
          return false;
        }
      }
      return true;
    }
    return false;
  }
}
