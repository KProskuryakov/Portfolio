import assert = require("assert");

import Tile, * as TileModule from "../Tile";

import Direction from "../Direction";

describe("Tile", function() {
  describe("#directionToTile", function() {
    it("returns a tile given a valid direction", function() {
      const t1 = TileModule.directionToTile(Direction.NORTH);
      const t2 = TileModule.directionToTile(Direction.EAST);
      const t3 = TileModule.directionToTile(Direction.SOUTH);
      const t4 = TileModule.directionToTile(Direction.WEST);

      assert.deepEqual(t1, { x: 0, y: -1 });
      assert.deepEqual(t2, { x: 1, y: 0 });
      assert.deepEqual(t3, { x: 0, y: 1 });
      assert.deepEqual(t4, { x: -1, y: 0 });
    });

    it("throws error if invalid direction", function() {
      assert.throws(() => {
        TileModule.directionToTile(Direction.SPLIT_SOUTH_TO_HORI);
      });
      assert.throws(() => {
        TileModule.directionToTile(Direction.SPLIT_WEST_TO_VERT);
      });
      assert.throws(() => {
        TileModule.directionToTile(Direction.NONE);
      });
    });
  });

  describe("#nextTile", function() {
    it("returns the next tile in a direction", function() {
      const tile = {x: 3, y: 3};

      assert.deepEqual(TileModule.nextTile(tile, Direction.NORTH), {x: 3, y: 2});
      assert.deepEqual(TileModule.nextTile(tile, Direction.EAST), {x: 4, y: 3});
      assert.deepEqual(TileModule.nextTile(tile, Direction.SOUTH), {x: 3, y: 4});
      assert.deepEqual(TileModule.nextTile(tile, Direction.WEST), {x: 2, y: 3});
    });

    it("throws an exception if invalid direction", function() {
      assert.throws(() => {
        TileModule.nextTile({x: 0, y: 0}, Direction.NONE);
      });
      assert.throws(() => {
        TileModule.nextTile({x: 0, y: 0}, Direction.SPLIT_SOUTH_TO_HORI);
      });
      assert.throws(() => {
        TileModule.nextTile({x: 0, y: 0}, Direction.SPLIT_WEST_TO_VERT);
      });
    });
  });

  describe("#addTiles", function() {
    it("returns a new tile with the sum of the x/y components", function() {
      assert.deepEqual(TileModule.addTiles({x: 0, y: 0}, {x: 0, y: 0}), {x: 0, y: 0});
      assert.deepEqual(TileModule.addTiles({x: 1, y: 0}, {x: 0, y: 0}), {x: 1, y: 0});
      assert.deepEqual(TileModule.addTiles({x: 0, y: 2}, {x: 0, y: 0}), {x: 0, y: 2});
      assert.deepEqual(TileModule.addTiles({x: 1, y: 1}, {x: -1, y: -2}), {x: 0, y: -1});
      assert.deepEqual(TileModule.addTiles({x: 0, y: -1}, {x: -4, y: 1}), {x: -4, y: 0});
    });
  });

  describe("#subTiles", function() {
    it("returns a new tile with the 1st tile's components subtracted from the 2nd", function() {
      assert.deepEqual(TileModule.subTiles({x: 0, y: 0}, {x: 0, y: 0}), {x: 0, y: 0});
      assert.deepEqual(TileModule.subTiles({x: 1, y: 0}, {x: 0, y: 0}), {x: 1, y: 0});
      assert.deepEqual(TileModule.subTiles({x: 0, y: 2}, {x: 0, y: 0}), {x: 0, y: 2});
      assert.deepEqual(TileModule.subTiles({x: 1, y: 1}, {x: -1, y: -2}), {x: 2, y: 3});
      assert.deepEqual(TileModule.subTiles({x: 0, y: -1}, {x: -4, y: 1}), {x: 4, y: -2});
    });
  });

  describe("#negTile", function() {
    it("returns a tile with the properties negated", function() {
      assert.deepEqual(TileModule.negTile({x: 0, y: 0}), {x: 0, y: 0});
      assert.deepEqual(TileModule.negTile({x: 1, y: -1}), {x: -1, y: 1});
      assert.deepEqual(TileModule.negTile({x: -1, y: 1}), {x: 1, y: -1});
    });
  });

  describe("#copyTile", function() {
    it("creates a copy of a tile", function() {
      const t1 = {x: 1, y: 2};
      const t2 = TileModule.copyTile(t1);

      assert.deepEqual(t1, t2);
      assert.notEqual(t1, t2);
    });
  });

  describe("#tileNotNegative", function() {
    it("returns true if tile not negative", function() {
      assert.ok(TileModule.tileNotNegative({x: 0, y: 0}));
      assert.ok(TileModule.tileNotNegative({x: 5, y: 0}));
      assert.ok(TileModule.tileNotNegative({x: 10, y: 20}));
    });

    it("returns false if tile is negative", function() {
      assert.ok(!TileModule.tileNotNegative({x: -1, y: 50}));
      assert.ok(!TileModule.tileNotNegative({x: 0, y: -5}));
      assert.ok(!TileModule.tileNotNegative({x: -10, y: -20}));
    });
  });

  describe("#tileWithinAreaInclusive", function() {
    it("returns true if the tile is within the area including edges", function() {
      const min = {x: 0, y: 0};
      const max = {x: 5, y: 10};

      assert.ok(TileModule.tileWithinAreaInclusive({x: 0, y: 0}, min, max));
      assert.ok(TileModule.tileWithinAreaInclusive({x: 5, y: 10}, min, max));
      assert.ok(TileModule.tileWithinAreaInclusive({x: 5, y: 3}, min, max));
      assert.ok(TileModule.tileWithinAreaInclusive({x: 2, y: 1}, min, max));
      assert.ok(TileModule.tileWithinAreaInclusive({x: 3, y: 7}, min, max));
    });

    it("returns false if the tile is outside of the edges", function() {
      const min = {x: 0, y: 0};
      const max = {x: 5, y: 10};

      assert.ok(!TileModule.tileWithinAreaInclusive({x: 0, y: -1}, min, max));
      assert.ok(!TileModule.tileWithinAreaInclusive({x: 6, y: 10}, min, max));
      assert.ok(!TileModule.tileWithinAreaInclusive({x: -1, y: -5}, min, max));
      assert.ok(!TileModule.tileWithinAreaInclusive({x: 4, y: 31}, min, max));
      assert.ok(!TileModule.tileWithinAreaInclusive({x: 6, y: 3}, min, max));
    });
  });

  describe("#tileWithinAreaExclusive", function() {
    it("returns true if the tile is within the area excluding edges", function() {
      const min = {x: 0, y: 0};
      const max = {x: 5, y: 10};

      assert.ok(TileModule.tileWithinAreaExclusive({x: 1, y: 1}, min, max));
      assert.ok(TileModule.tileWithinAreaExclusive({x: 4, y: 9}, min, max));
      assert.ok(TileModule.tileWithinAreaExclusive({x: 3, y: 2}, min, max));
    });

    it("returns false if the tile is on the edge or outside the edge", function() {
      const min = {x: 0, y: 0};
      const max = {x: 5, y: 10};

      assert.ok(!TileModule.tileWithinAreaExclusive({x: 0, y: 4}, min, max));
      assert.ok(!TileModule.tileWithinAreaExclusive({x: 4, y: 10}, min, max));
      assert.ok(!TileModule.tileWithinAreaExclusive({x: 5, y: 3}, min, max));
      assert.ok(!TileModule.tileWithinAreaExclusive({x: 6, y: 13}, min, max));
      assert.ok(!TileModule.tileWithinAreaExclusive({x: -1, y: 0}, min, max));
    });
  });
});
