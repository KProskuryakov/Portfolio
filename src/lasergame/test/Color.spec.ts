import assert = require("assert");

import Color, * as colorFuncs from "../Color";

describe("Color", function() {
  describe("#addColors", function() {
    it("bunch of color addition tests", function() {
      assert.equal(colorFuncs.addColors(Color.BLACK, Color.BLACK), Color.BLACK);
      assert.equal(colorFuncs.addColors(Color.RED, Color.RED), Color.RED);
      assert.equal(colorFuncs.addColors(Color.WHITE, Color.WHITE), Color.WHITE);
      assert.equal(colorFuncs.addColors(Color.YELLOW, Color.CYAN), Color.WHITE);
      assert.equal(colorFuncs.addColors(Color.BLUE, Color.GREEN), Color.CYAN);
      assert.equal(colorFuncs.addColors(Color.RED, Color.WHITE), Color.WHITE);
      assert.equal(colorFuncs.addColors(Color.RED, Color.WHITE), Color.WHITE);
    });
  });

  describe("#colorToRGBString", function() {
    it("correctly creates rgb strings", function() {
      assert.equal(colorFuncs.colorToRGBString(Color.BLACK), "rgb(0,0,0)");
      assert.equal(colorFuncs.colorToRGBString(Color.RED), "rgb(255,0,0)");
      assert.equal(colorFuncs.colorToRGBString(Color.GREEN), "rgb(0,255,0)");
      assert.equal(colorFuncs.colorToRGBString(Color.BLUE), "rgb(0,0,255)");
      assert.equal(colorFuncs.colorToRGBString(Color.CYAN), "rgb(0,255,255)");
      assert.equal(colorFuncs.colorToRGBString(Color.YELLOW), "rgb(255,255,0)");
      assert.equal(colorFuncs.colorToRGBString(Color.MAGENTA), "rgb(255,0,255)");
      assert.equal(colorFuncs.colorToRGBString(Color.WHITE), "rgb(255,255,255)");
    });
  });

  describe("#colorToName", function() {
    it("names correctly", function() {
      assert.equal(colorFuncs.colorToName(Color.BLACK), "BLACK");
      assert.equal(colorFuncs.colorToName(Color.WHITE), "WHITE");
    });
  });
});

// TODO more fun tests!
