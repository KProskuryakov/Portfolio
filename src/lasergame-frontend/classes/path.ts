import Ending from './ending'

export default class Path {
  readonly start: number
  readonly endings: Ending[]

  /**
   * Ending list is guaranteed to be sorted (as long as endings aren't messed with)
   * @param {number} start 
   * @param {Ending[]} endings 
   * @memberof Path
   */
  constructor(start: number, endings: Ending[]) {
    this.start = start
    this.endings = endings.sort((a, b) => {
      if (a.end < b.end) 
        return -1
      else
        return 1
    })
  }

  toString() {
    return this.startToString() + this.endingListToString()
  }

  startToString() {
    let string = `${this.start}`
    if (this.start < 10) {
      string += "  -> "
    } else {
      string += " -> "
    }
    return string
  }

  endingListToString() {
    if (this.endings.length > 1) {
      let string = `{${this.endings[0].toString()}, `
      for (let curEnding = 1; curEnding < this.endings.length - 1; curEnding++) {
        string += `${this.endings[curEnding].toString()}, `
      }
      string += `${this.endings[this.endings.length - 1].toString()}}`
      return string
    }
    return this.endings[0].toString()
  }

  endingsEqual(otherPath: Path) {
    if (this.endings.length === otherPath.endings.length) {
      for (let i = 0; i < this.endings.length; i++) {
        if (!this.endings[i].equals(otherPath.endings[i])) {
          return false
        }
      }
      return true
    }
    return false
  }

  static fromJSONObject(json: Path) {
    let endingsList: Ending[] = []
    for (let i = 0; i < json.endings.length; i++) {
      endingsList.push(Ending.fromJSON(json.endings[i]))
    }
    return new Path(json.start, endingsList)
  }
}