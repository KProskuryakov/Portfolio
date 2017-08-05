import Color from "lasergame/color";
import { Direction, Pieces } from "lasergame/enum";
import Mirror from "lasergame/mirror";
import Piece from "lasergame/piece";
import Swatch from "lasergame/swatch";

export const pieces: Piece[] = [];

pieces[Pieces.ForwardSlash] = new Mirror(Direction.East, Direction.North, Direction.West, Direction.South);
pieces[Pieces.BackSlash] = new Mirror(Direction.West, Direction.South, Direction.East, Direction.North);
pieces[Pieces.BlackHole] = new Mirror(Direction.None, Direction.None, Direction.None, Direction.None);
pieces[Pieces.SideSplit] = new Mirror(Direction.East, Direction.None, Direction.East, Direction.SplitNorthSouth);
pieces[Pieces.UpSplit] = new Mirror(Direction.None, Direction.North, Direction.SplitEastWest, Direction.North);
pieces[Pieces.Blue] = new Swatch(new Color(0, 0, 255));
pieces[Pieces.Red] = new Swatch(new Color(255, 0, 0));
pieces[Pieces.Green] = new Swatch(new Color(0, 255, 0));
