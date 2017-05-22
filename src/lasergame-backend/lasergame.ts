import Lasergrid from '../lasergame-frontend/classes/lasergrid';
import { pieces } from '../lasergame-frontend/pieces';
import Piece from '../lasergame-frontend/classes/piece';
import Tile from '../lasergame-frontend/classes/tile';
import Ending from '../lasergame-frontend/classes/ending';
import Path from '../lasergame-frontend/classes/path';

export function generateRandomLevel() {
  let randomGrid = new Lasergrid();

  pieces.forEach((piece: Piece) => {
    while (true) {
      let randTile = new Tile(Math.floor(Math.random() * 5), Math.floor(Math.random() * 5));
      if (!randomGrid.getPiece(randTile)) {
        randomGrid.setPiece(piece, randTile);
        break;
      }
    }
  });

  randomGrid.calculateAllEndings();

  let randomEndings: Path[] = [];

  for (let i = 0; i < 5; i++) {
    while (true) {
      let randomEnding = Math.floor(Math.random() * 20 + 1);
      let used = false;
      for (let j = 0; j < randomEndings.length; j++) {
        if (randomEndings[j].start === randomEnding) {
          used = true;
          break;
        }
      }
      if (!used) {
        randomEndings.push(randomGrid.paths[randomEnding]);
        break;
      }
    }
  }

  randomEndings.sort((a ,b) => {return a.start < b.start ? -1 : 1});

  return randomEndings;
}