import Color from "./Color";
import Direction from "./Direction";
import Mirror from "./Mirror";
import Piece from "./Piece";
import PieceType from "./PieceType";
import Swatch from "./Swatch";

const Pieces: Piece[] = [];

Pieces[PieceType.ForwardSlash] = new Mirror(Direction.East, Direction.North, Direction.West, Direction.South);
Pieces[PieceType.BackSlash] = new Mirror(Direction.West, Direction.South, Direction.East, Direction.North);
Pieces[PieceType.BlackHole] = new Mirror(Direction.None, Direction.None, Direction.None, Direction.None);
Pieces[PieceType.SideSplit] = new Mirror(Direction.East, Direction.None, Direction.East, Direction.SplitNorthSouth);
Pieces[PieceType.UpSplit] = new Mirror(Direction.None, Direction.North, Direction.SplitEastWest, Direction.North);
Pieces[PieceType.Blue] = new Swatch(new Color(0, 0, 255));
Pieces[PieceType.Red] = new Swatch(new Color(255, 0, 0));
Pieces[PieceType.Green] = new Swatch(new Color(0, 255, 0));

export default Pieces;
