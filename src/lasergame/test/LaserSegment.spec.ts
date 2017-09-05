import assert = require("assert");

import LaserSegment, {copyLaserSegment, getOppositeLaserSegment} from "../LaserSegment";

import Color from "../Color";
import Direction from "../Direction";

describe("LaserSegment", function() {
  describe("#getOppositeLaserSegment", function() {
    it("creates a laser segment with the opposite direction set", function() {
      const l1 = {tile: {x: 1, y: 1}, dir: Direction.NORTH, color: Color.GREEN};
      const l2 = getOppositeLaserSegment(l1);

      assert.equal(l2.dir, Direction.SOUTH);
    });
  });

  describe("#copyLaserSegment", function() {
    it("creates a copy of the laser segment", function() {
      const l1 = {tile: {x: 1, y: 1}, dir: Direction.NORTH, color: Color.GREEN};
      const l2 = copyLaserSegment(l1);

      assert.deepEqual(l1, l2);
      assert.notEqual(l1, l2);
    });
  });
});
