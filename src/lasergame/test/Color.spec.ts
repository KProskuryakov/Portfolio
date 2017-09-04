import assert = require("assert");

import Color, {addColors, colorToName, colorToRGBString} from "../Color";

describe("Color", function() {
  describe("#addColors", function() {
    it("bunch of color addition tests", function() {
      assert.equal(addColors(Color.BLACK, Color.BLACK), Color.BLACK);
      assert.equal(addColors(Color.RED, Color.RED), Color.RED);
      assert.equal(addColors(Color.WHITE, Color.WHITE), Color.WHITE);
      assert.equal(addColors(Color.YELLOW, Color.CYAN), Color.WHITE);
      assert.equal(addColors(Color.BLUE, Color.GREEN), Color.CYAN);
      assert.equal(addColors(Color.RED, Color.WHITE), Color.WHITE);
      assert.equal(addColors(Color.RED, Color.WHITE), Color.WHITE);
    });
  });

  describe("#colorToRGBString", function() {
    it("correctly creates rgb strings", function() {
      assert.equal(colorToRGBString(Color.BLACK), "rgb(0,0,0)");
      assert.equal(colorToRGBString(Color.RED), "rgb(255,0,0)");
      assert.equal(colorToRGBString(Color.GREEN), "rgb(0,255,0)");
      assert.equal(colorToRGBString(Color.BLUE), "rgb(0,0,255)");
      assert.equal(colorToRGBString(Color.CYAN), "rgb(0,255,255)");
      assert.equal(colorToRGBString(Color.YELLOW), "rgb(255,255,0)");
      assert.equal(colorToRGBString(Color.MAGENTA), "rgb(255,0,255)");
      assert.equal(colorToRGBString(Color.WHITE), "rgb(255,255,255)");
    });
  });

  describe("#colorToName", function() {
    it("names correctly", function() {
      assert.equal(colorToName(Color.BLACK), "BLACK");
      assert.equal(colorToName(Color.WHITE), "WHITE");
    });
  });
});
