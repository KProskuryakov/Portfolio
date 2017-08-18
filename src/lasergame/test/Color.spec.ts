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

    it("Can be created from a JSON object", function() {
      const redJSON = {r: 255, g: 0, b: 255};
      const blackJSON = {r: 0, g: 0, b: 0};

      const red = Color.fromJSON(redJSON);
      const black = Color.fromJSON(blackJSON);

      assert.equal(red.toName(), "red");
      assert.equal(black.toName(), "black");
    });
  });

  describe("When manipulating colors", function() {
    it("Can add colors together", function() {
      // TODO add colors test
    });
  });
});

// TODO more fun tests!
