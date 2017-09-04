import assert = require("assert");

import LaserGrid, * as LaserGridModule from "../LaserGrid";

describe("LaserGrid", function() {
  describe("#makeDefaultGrid", function() {
    it("creates the default grid", function() {
      assert.ok(false);
    });
  });

  describe("#makeCustomGrid", function() {
    it("creates a custom grid given the available pieces", function() {
      assert.ok(false);
    });
  });

  describe("#tileToEdgeNumber", function() {
    it("gives back the edge number for a valid tile", function() {
      assert.ok(false);
    });

    it("throws an exception if invalid tile", function() {
      assert.ok(false);
    });
  });

  describe("#edgeNumberToLaser", function() {
    it("returns the laser from the valid edge number", function() {
      assert.ok(false);
    });

    it("throws exception if invalid edge number", function() {
      assert.ok(false);
    });
  });

  describe("#getPieceFromGrid", function() {
    it("returns the piece if it exists", function() {
      assert.ok(false);
    });

    it("returns undefined if the piece does not exist", function() {
      assert.ok(false);
    });

    it("throws an exception if out of bounds", function() {
      assert.ok(false);
    });
  });

  describe("#isValidSpace", function() {
    it("returns true if tile is within bounds", function() {
      assert.ok(false);
    });

    it("returns false if tile is out of bounds", function() {
      assert.ok(false);
    });
  });

  describe("#removePieceFromGrid", function() {
    it("removes the piece if it is placed", function() {
      assert.ok(false);
    });

    it("throws an exception if piece is not placed (or invalid)", function() {
      assert.ok(false);
    });

    it("calculates endings if calculate is true", function() {
      assert.ok(false);
    });

    it("does not calculate endings if calculate is false", function() {
      assert.ok(false);
    });
  });

  describe("setPieceInGrid", function() {
    it("places piece in grid if not in grid", function() {
      assert.ok(false);
    });

    it("replaces piece in grid if in grid", function() {
      assert.ok(false);
    });
  });

  describe("#calculateAllEndings", function() {
    it("calculates all the endings", function() {
      assert.ok(false);
    });
  });
});
