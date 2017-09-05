import assert = require("assert");

import Direction, {getOppositeDirection} from "../Direction";

describe("Direction", function() {
  describe("#getOppositeDirection", function() {
    it("sets opposite direction of cardinal directions", function() {
      assert.equal(Direction.SOUTH, getOppositeDirection(Direction.NORTH), "North");
      assert.equal(Direction.NORTH, getOppositeDirection(Direction.SOUTH), "South");
      assert.equal(Direction.EAST, getOppositeDirection(Direction.WEST), "West");
      assert.equal(Direction.WEST, getOppositeDirection(Direction.EAST), "East");
    });

    it("throws exception if invalid direction fed to function", function() {
      assert.throws(() => getOppositeDirection(Direction.NONE), "None");
      assert.throws(() => getOppositeDirection(Direction.SPLIT_SOUTH_TO_HORI), "Split east/west");
      assert.throws(() => getOppositeDirection(Direction.SPLIT_WEST_TO_VERT), "Split north/south");
    });
  });
});
