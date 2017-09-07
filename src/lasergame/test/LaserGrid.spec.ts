import assert = require("assert");

import LaserGrid, * as LaserGridModule from "../LaserGrid";

import Color from "../Color";
import Direction from "../Direction";
import Path from "../Path";
import PieceID from "../PieceID";

describe("LaserGrid", function() {
  describe("#makeDefaultGrid", function() {
    it("creates the default grid", function() {
      const lg = LaserGridModule.makeDefaultGrid();

      assert.deepEqual(lg.grid, [[], [], [], [], []]);
      assert.equal(lg.length, 5);
      assert.equal(lg.width, 5);
      assert.deepEqual(lg.paths[0], { start: 1, endings: [{ end: 15, color: Color.BLACK }] });
      assert.deepEqual(lg.availablePieces[0], { pieceID: 0, tile: { x: -1, y: -1 } });
    });
  });

  describe("#makeCustomGrid", function() {
    it("creates a custom grid given the available pieces", function() {
      const lg = LaserGridModule.makeCustomGrid([{ pieceID: 5, tile: { x: -1, y: -1 } }]);

      assert.deepEqual(lg.grid, [[], [], [], [], []]);
      assert.equal(lg.length, 5);
      assert.equal(lg.width, 5);
      assert.deepEqual(lg.paths[0], { start: 1, endings: [{ end: 15, color: Color.BLACK }] });
      assert.deepEqual(lg.availablePieces[0], { pieceID: 5, tile: { x: -1, y: -1 } });
    });
  });

  describe("#tileToEdgeNumber", function() {
    it("gives back the edge number for a valid tile", function() {
      const lg = LaserGridModule.makeDefaultGrid();

      const e1 = LaserGridModule.tileToEdgeNumber(lg, { x: 0, y: -1 });
      const e2 = LaserGridModule.tileToEdgeNumber(lg, { x: 5, y: 0 });
      const e3 = LaserGridModule.tileToEdgeNumber(lg, { x: 4, y: 5 });
      const e4 = LaserGridModule.tileToEdgeNumber(lg, { x: -1, y: 4 });

      assert.equal(e1, 1);
      assert.equal(e2, 6);
      assert.equal(e3, 11);
      assert.equal(e4, 16);
    });

    it("throws an exception if invalid tile", function() {
      const lg = LaserGridModule.makeDefaultGrid();

      assert.throws((err: Error) => {
        LaserGridModule.tileToEdgeNumber(lg, { x: 3, y: 3 });
      });
    });
  });

  describe("#edgeNumberToLaser", function() {
    it("returns the laser from the valid edge number", function() {
      const l1 = LaserGridModule.edgeNumberToLaser(1);
      const l2 = LaserGridModule.edgeNumberToLaser(6);
      const l3 = LaserGridModule.edgeNumberToLaser(11);
      const l4 = LaserGridModule.edgeNumberToLaser(16);

      assert.deepEqual(l1, { tile: { x: 0, y: -1 }, dir: Direction.SOUTH, color: Color.BLACK });
      assert.deepEqual(l2, { tile: { x: 5, y: 0 }, dir: Direction.WEST, color: Color.BLACK });
      assert.deepEqual(l3, { tile: { x: 4, y: 5 }, dir: Direction.NORTH, color: Color.BLACK });
      assert.deepEqual(l4, { tile: { x: -1, y: 4 }, dir: Direction.EAST, color: Color.BLACK });
    });

    it("throws exception if invalid edge number", function() {
      assert.throws((err: Error) => {
        LaserGridModule.edgeNumberToLaser(-1);
      });

      assert.throws((err: Error) => {
        LaserGridModule.edgeNumberToLaser(23);
      });
    });
  });

  describe("#getPieceFromGrid", function() {
    it("returns the piece if it exists", function() {
      const lg = LaserGridModule.makeDefaultGrid();
      const piece: LaserGridModule.GridPiece = {pieceID: 0, tile: {x: -1, y: -1}};
      lg.grid[2][3] = piece;

      assert.equal(LaserGridModule.getPieceFromGrid(lg, {x: 3, y: 2}), piece);
    });

    it("returns undefined if the piece does not exist", function() {
      const lg = LaserGridModule.makeDefaultGrid();
      assert.equal(LaserGridModule.getPieceFromGrid(lg, {x: 1, y: 1}), undefined);
    });

    it("throws an exception if out of bounds", function() {
      const lg = LaserGridModule.makeDefaultGrid();
      assert.throws((err: Error) => {
        LaserGridModule.getPieceFromGrid(lg, {x: 5, y: 5});
      });
    });
  });

  describe("#isValidSpace", function() {
    it("returns true if tile is within bounds", function() {
      const lg = LaserGridModule.makeDefaultGrid();
      assert.ok(LaserGridModule.isValidSpace(lg, {x: 1, y: 1}));
    });

    it("returns false if tile is out of bounds", function() {
      const lg = LaserGridModule.makeDefaultGrid();
      assert.ok(!LaserGridModule.isValidSpace(lg, {x: -1, y: 1}));
    });
  });

  describe("#removePieceFromGrid", function() {
    it("removes the piece if it is placed", function() {
      const lg = LaserGridModule.makeDefaultGrid();
      const piece: LaserGridModule.GridPiece = {pieceID: 0, tile: {x: 3, y: 2}};
      lg.grid[2][3] = piece;

      LaserGridModule.removePieceFromGrid(lg, piece);

      assert.deepEqual(piece.tile, {x: -1, y: -1});
      assert.equal(lg.grid[2][3], undefined);
    });

    it("throws an exception if piece is not placed (or invalid)", function() {
      const lg = LaserGridModule.makeDefaultGrid();
      const piece = {pieceID: 0, tile: {x: 3, y: 2}};

      assert.throws((err: Error) => {
        LaserGridModule.removePieceFromGrid(lg, piece);
      });

      piece.tile = {x: -1, y: -1};
      lg.grid[2][3] = piece;

      assert.throws((err: Error) => {
        LaserGridModule.removePieceFromGrid(lg, piece);
      });
    });
  });

  describe("setPieceInGrid", function() {
    it("places piece in grid if not in grid", function() {
      const lg = LaserGridModule.makeDefaultGrid();
      const piece = {pieceID: 0, tile: {x: -1, y: -1}};

      LaserGridModule.setPieceInGrid(lg, piece, {x: 4, y: 1});

      assert.deepEqual(piece.tile, {x: 4, y: 1});
      assert.equal(lg.grid[1][4], piece);
    });

    it("replaces piece in grid if in grid", function() {
      const lg = LaserGridModule.makeDefaultGrid();
      const piece = {pieceID: 0, tile: {x: 3, y: 2}};
      lg.grid[2][3] = piece;

      LaserGridModule.setPieceInGrid(lg, piece, {x: 4, y: 4});

      assert.deepEqual(piece.tile, {x: 4, y: 4});
      assert.equal(lg.grid[4][4], piece);
      assert.equal(lg.grid[2][3], undefined);
    });

    it("throws an exception if tile is not valid", function() {
      const lg = LaserGridModule.makeDefaultGrid();
      const piece = {pieceID: 0, tile: {x: 3, y: 2}};

      assert.throws((err: Error) => {
        LaserGridModule.setPieceInGrid(lg, piece, {x: -1, y: 1});
      });
    });
  });

  describe("#calculateAllEndings", function() {
    it("creates the appropriate default ending list given the default grid", function() {
      const lg = LaserGridModule.makeDefaultGrid();
      const expectedPathsList: Path[] = [
        {start: 1, endings: [{end: 15, color: Color.BLACK}]},
        {start: 2, endings: [{end: 14, color: Color.BLACK}]},
        {start: 3, endings: [{end: 13, color: Color.BLACK}]},
        {start: 4, endings: [{end: 12, color: Color.BLACK}]},
        {start: 5, endings: [{end: 11, color: Color.BLACK}]},
        {start: 6, endings: [{end: 20, color: Color.BLACK}]},
        {start: 7, endings: [{end: 19, color: Color.BLACK}]},
        {start: 8, endings: [{end: 18, color: Color.BLACK}]},
        {start: 9, endings: [{end: 17, color: Color.BLACK}]},
        {start: 10, endings: [{end: 16, color: Color.BLACK}]},
        {start: 11, endings: [{end: 5, color: Color.BLACK}]},
        {start: 12, endings: [{end: 4, color: Color.BLACK}]},
        {start: 13, endings: [{end: 3, color: Color.BLACK}]},
        {start: 14, endings: [{end: 2, color: Color.BLACK}]},
        {start: 15, endings: [{end: 1, color: Color.BLACK}]},
        {start: 16, endings: [{end: 10, color: Color.BLACK}]},
        {start: 17, endings: [{end: 9, color: Color.BLACK}]},
        {start: 18, endings: [{end: 8, color: Color.BLACK}]},
        {start: 19, endings: [{end: 7, color: Color.BLACK}]},
        {start: 20, endings: [{end: 6, color: Color.BLACK}]},
      ];
      assert.deepEqual(lg.paths, expectedPathsList);
    });

    it("calculates all the endings for a grid with pieces in it", function() {
      const lg = LaserGridModule.makeDefaultGrid();

      LaserGridModule.setPieceInGrid(lg, lg.availablePieces[PieceID.FORWARD_SLASH], {x: 0, y: 0});
      LaserGridModule.setPieceInGrid(lg, lg.availablePieces[PieceID.RED], {x: 4, y: 4});


      const expectedPathsList: Path[] = [
        {start: 1, endings: [{end: 20, color: Color.BLACK}]},
        {start: 2, endings: [{end: 14, color: Color.BLACK}]},
        {start: 3, endings: [{end: 13, color: Color.BLACK}]},
        {start: 4, endings: [{end: 12, color: Color.BLACK}]},
        {start: 5, endings: [{end: 11, color: Color.RED}]},
        {start: 6, endings: [{end: 15, color: Color.BLACK}]},
        {start: 7, endings: [{end: 19, color: Color.BLACK}]},
        {start: 8, endings: [{end: 18, color: Color.BLACK}]},
        {start: 9, endings: [{end: 17, color: Color.BLACK}]},
        {start: 10, endings: [{end: 16, color: Color.RED}]},
        {start: 11, endings: [{end: 5, color: Color.RED}]},
        {start: 12, endings: [{end: 4, color: Color.BLACK}]},
        {start: 13, endings: [{end: 3, color: Color.BLACK}]},
        {start: 14, endings: [{end: 2, color: Color.BLACK}]},
        {start: 15, endings: [{end: 6, color: Color.BLACK}]},
        {start: 16, endings: [{end: 10, color: Color.RED}]},
        {start: 17, endings: [{end: 9, color: Color.BLACK}]},
        {start: 18, endings: [{end: 8, color: Color.BLACK}]},
        {start: 19, endings: [{end: 7, color: Color.BLACK}]},
        {start: 20, endings: [{end: 1, color: Color.BLACK}]},
      ];
      assert.deepEqual(lg.paths, expectedPathsList);
    });
  });
});
