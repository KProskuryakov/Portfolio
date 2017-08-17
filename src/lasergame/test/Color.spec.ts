import assert = require("assert");

import Color from "../Color";

describe("Color", function() {
  describe("When creating the object", function() {
    it("Can be created from a specific string", function() {
      const redColor = new Color(255, 0, 0);
      const blackColor = new Color(0, 0, 0);

      const redFromString = Color.colorFromName("red");
      const wrongString = Color.colorFromName("blark");

      assert.deepEqual(redFromString, redColor);
      assert.deepEqual(wrongString, blackColor);
    });
  });
});
