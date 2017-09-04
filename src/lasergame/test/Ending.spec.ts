import assert = require("assert");

import Color from "../Color";
import Ending, {End, endingsEqual} from "../Ending";

describe("Ending", function() {
  describe("#endingsEqual", function() {
    it("returns true when endings are the same", function() {
      const e1: Ending = {end: 5, color: Color.RED};
      const e2: Ending = {end: 5, color: Color.RED};

      assert.ok(endingsEqual(e1, e2));
    });

    it("returns false when endings are not the same", function() {
      const e1: Ending = {end: 5, color: Color.RED};
      const e2: Ending = {end: 6, color: Color.RED};

      assert.ok(!endingsEqual(e1, e2));
    });
  });
});
