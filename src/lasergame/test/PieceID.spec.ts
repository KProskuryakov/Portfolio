import assert = require("assert");

import PieceID, {applyPieceToLaser} from "../PieceID";

import Color from "../Color";
import Direction from "../Direction";

describe("PieceID", function() {
  describe("#applyPieceToLaser", function() {
    it("applies direction to laser", function() {
      const l1 = {tile: {x: 1, y: 1}, dir: Direction.NORTH, color: Color.GREEN};
      applyPieceToLaser(l1, PieceID.FORWARD_SLASH);
      assert.equal(l1.dir, Direction.EAST);

      const l2 = {tile: {x: 1, y: 1}, dir: Direction.NORTH, color: Color.GREEN};
      applyPieceToLaser(l2, PieceID.BLACK_HOLE);
      assert.equal(l2.dir, Direction.NONE);

      const l3 = {tile: {x: 1, y: 1}, dir: Direction.SOUTH, color: Color.GREEN};
      applyPieceToLaser(l3, PieceID.SOUTH_TO_HORI);
      assert.equal(l3.dir, Direction.SPLIT_SOUTH_TO_HORI);
    });

    it("applies color to laser", function() {
      const l1 = {tile: {x: 1, y: 1}, dir: Direction.NORTH, color: Color.GREEN};
      applyPieceToLaser(l1, PieceID.BLUE);
      assert.equal(l1.color, Color.CYAN);
    });

    it("applies size to laser", function() {
      const l1 = {tile: {x: 1, y: 1}, dir: Direction.NORTH, color: Color.GREEN};
      applyPieceToLaser(l1, PieceID.PLUS);

      assert.ok(false);
    });
  });
});
