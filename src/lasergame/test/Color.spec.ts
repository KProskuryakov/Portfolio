import assert = require("assert");

import Color from "../Color";
import ColorName from "../ColorName";

describe("Color", function() {
  describe("#getInstance", function() {
    it("gets a color instance", function() {
      assert.equal(Color.getInstance(ColorName.BLACK).name(), "BLACK");
    });

    it("does not duplicate instances", function() {
      assert.ok(Color.getInstance(ColorName.WHITE) === Color.getInstance(ColorName.WHITE));
    });
  });

  describe("#addColors", function() {
    it("adds colors", function() {
      const black = Color.getInstance(ColorName.BLACK);
      const black2 = Color.getInstance(ColorName.BLACK);
      const red = Color.getInstance(ColorName.RED);

      assert.equal(black.add(black2), black);
      assert.equal(black.add(black2), black2);
      assert.equal(black.add(red), red);
    });
  });

  describe("#colorToRGBString", function() {
    it("correctly creates rgb strings", function() {
      assert.equal(Color.getInstance(ColorName.BLACK).toRGBString(), "rgb(0,0,0)");
      assert.equal(Color.getInstance(ColorName.RED).toRGBString(), "rgb(255,0,0)");
      assert.equal(Color.getInstance(ColorName.GREEN).toRGBString(), "rgb(0,255,0)");
      assert.equal(Color.getInstance(ColorName.BLUE).toRGBString(), "rgb(0,0,255)");
      assert.equal(Color.getInstance(ColorName.CYAN).toRGBString(), "rgb(0,255,255)");
      assert.equal(Color.getInstance(ColorName.YELLOW).toRGBString(), "rgb(255,255,0)");
      assert.equal(Color.getInstance(ColorName.MAGENTA).toRGBString(), "rgb(255,0,255)");
      assert.equal(Color.getInstance(ColorName.WHITE).toRGBString(), "rgb(255,255,255)");
    });
  });

  describe("#colorToName", function() {
    it("names correctly", function() {
      assert.equal(Color.getInstance(ColorName.BLACK).name(), "BLACK");
      assert.equal(Color.getInstance(ColorName.WHITE).name(), "WHITE");
    });
  });
});
