export enum Direction {
  North,
  East,
  South,
  West,
  None,
  SplitEastWest,
  SplitNorthSouth,
}

export enum End {
  Blocked = -2,
  Loop,
}

export enum Pieces {
  ForwardSlash,
  BackSlash,
  BlackHole,
  SideSplit,
  UpSplit,
  Blue,
  Red,
  Green,
}

export enum LevelType {
  Daily,
  Random,
  Custom,
}
