import assert = require("assert");

import Path, { equalPaths } from "../Path";

import Color from "../Color";

describe("Path", function() {
  describe("#equalPaths", function() {
    it("returns true if paths are equal", function() {
      const p1 = {start: 5, endings: [{end: 10, color: Color.BLUE}, {end: 4, color: Color.MAGENTA}]};
      const p2 = {start: 5, endings: [{end: 10, color: Color.BLUE}, {end: 4, color: Color.MAGENTA}]};

      const res = equalPaths(p1 , p2);
      assert.ok(res);
    });

    it("returns false if paths are not equal", function() {
      const p1 = {start: 5, endings: [{end: 10, color: Color.BLUE}, {end: 4, color: Color.MAGENTA}]};
      const p2 = {start: 5, endings: [{end: 10, color: Color.BLUE}, {end: 3, color: Color.MAGENTA}]};

      const res = equalPaths(p1 , p2);
      assert.ok(!res);
    });
  });
});
