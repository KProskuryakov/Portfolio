/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var const_1 = __webpack_require__(1);
var Tile = (function () {
    function Tile(tileX, tileY) {
        if (tileX === void 0) { tileX = -1; }
        if (tileY === void 0) { tileY = -1; }
        this.tileX = tileX;
        this.tileY = tileY;
    }
    Tile.TileFromPixels = function (x, y) {
        return new Tile(Math.floor(x / const_1.TILE_FULL), Math.floor(y / const_1.TILE_FULL));
    };
    Tile.prototype.isValid = function (maxX, maxY) {
        if (maxX === void 0) { maxX = Infinity; }
        if (maxY === void 0) { maxY = Infinity; }
        return (this.tileX > -1 && this.tileY > -1 && this.tileX < maxX && this.tileY < maxY);
    };
    Tile.prototype.toPixels = function () {
        return { x: this.tileX * const_1.TILE_FULL, y: this.tileY * const_1.TILE_FULL };
    };
    Tile.prototype.compare = function (tile, comparator) {
        return (comparator(this.tileX, tile.tileX) && comparator(this.tileY, tile.tileY));
    };
    Tile.prototype.minus = function (tile) {
        return new Tile(this.tileX - tile.tileX, this.tileY - tile.tileY);
    };
    Tile.prototype.add = function (tile) {
        return new Tile(this.tileX + tile.tileX, this.tileY + tile.tileY);
    };
    Tile.prototype.copy = function () {
        return new Tile(this.tileX, this.tileY);
    };
    Tile.prototype.nextTile = function (dir) {
        return this.add(const_1.directionMapping[dir]);
    };
    return Tile;
}());
exports.default = Tile;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tile_1 = __webpack_require__(0);
var enum_1 = __webpack_require__(2);
exports.importPre = document.getElementById("imported-pre");
exports.pathsPre = document.getElementById("paths-pre");
exports.canvas = document.getElementById("laser-game-canvas");
exports.ctx = exports.canvas.getContext("2d");
exports.TILE_FULL = 50;
exports.TILE_HALF = exports.TILE_FULL / 2;
exports.directionMapping = [];
exports.oppositeDirection = [];
exports.pieces = [];
exports.directionMapping[enum_1.Direction.North] = new tile_1.default(0, -1);
exports.directionMapping[enum_1.Direction.East] = new tile_1.default(1, 0);
exports.directionMapping[enum_1.Direction.South] = new tile_1.default(0, 1);
exports.directionMapping[enum_1.Direction.West] = new tile_1.default(-1, 0);
exports.oppositeDirection[enum_1.Direction.North] = enum_1.Direction.South;
exports.oppositeDirection[enum_1.Direction.East] = enum_1.Direction.West;
exports.oppositeDirection[enum_1.Direction.South] = enum_1.Direction.North;
exports.oppositeDirection[enum_1.Direction.West] = enum_1.Direction.East;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Direction;
(function (Direction) {
    Direction[Direction["North"] = 0] = "North";
    Direction[Direction["East"] = 1] = "East";
    Direction[Direction["South"] = 2] = "South";
    Direction[Direction["West"] = 3] = "West";
    Direction[Direction["None"] = 4] = "None";
    Direction[Direction["SplitEastWest"] = 5] = "SplitEastWest";
    Direction[Direction["SplitNorthSouth"] = 6] = "SplitNorthSouth";
})(Direction = exports.Direction || (exports.Direction = {}));
var End;
(function (End) {
    End[End["Blocked"] = -2] = "Blocked";
    End[End["Loop"] = -1] = "Loop";
})(End = exports.End || (exports.End = {}));
var Pieces;
(function (Pieces) {
    Pieces[Pieces["ForwardSlash"] = 0] = "ForwardSlash";
    Pieces[Pieces["BackSlash"] = 1] = "BackSlash";
    Pieces[Pieces["BlackHole"] = 2] = "BlackHole";
    Pieces[Pieces["SideSplit"] = 3] = "SideSplit";
    Pieces[Pieces["UpSplit"] = 4] = "UpSplit";
    Pieces[Pieces["Blue"] = 5] = "Blue";
    Pieces[Pieces["Red"] = 6] = "Red";
    Pieces[Pieces["Green"] = 7] = "Green";
})(Pieces = exports.Pieces || (exports.Pieces = {}));


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Color = (function () {
    function Color(r, g, b) {
        if (r === void 0) { r = 0; }
        if (g === void 0) { g = 0; }
        if (b === void 0) { b = 0; }
        this.r = r;
        this.g = g;
        this.b = b;
    }
    Color.prototype.add = function (color) {
        return new Color(Math.min(this.r + color.r, 255), Math.min(this.g + color.g, 255), Math.min(this.b + color.b, 255));
    };
    Color.prototype.copy = function () {
        return new Color(this.r, this.g, this.b);
    };
    Color.prototype.equals = function (otherColor) {
        return this.r === otherColor.r && this.g === otherColor.g && this.b === otherColor.b;
    };
    Color.prototype.toRGBString = function () {
        return "rgb(" + this.r + "," + this.g + "," + this.b + ")";
    };
    Color.prototype.toName = function () {
        if (this.r === 0) {
            if (this.g === 0) {
                if (this.b === 0) {
                    return "black";
                }
                return "blue";
            }
            if (this.b === 0) {
                return "green";
            }
            return "cyan";
        }
        if (this.g === 0) {
            if (this.b === 0) {
                return "red";
            }
            return "magenta";
        }
        if (this.b === 0) {
            return "yellow";
        }
        return "white";
    };
    Color.colorFromName = function (name) {
        switch (name) {
            case "black":
                return new Color(0, 0, 0);
            case "blue":
                return new Color(0, 0, 255);
            case "green":
                return new Color(0, 255, 0);
            case "red":
                return new Color(255, 0, 0);
            case "yellow":
                return new Color(255, 255, 0);
            case "cyan":
                return new Color(0, 255, 255);
            case "magenta":
                return new Color(255, 0, 255);
            case "white":
                return new Color(255, 255, 255);
        }
    };
    Color.fromJSON = function (color) {
        return new Color(color.r, color.g, color.b);
    };
    return Color;
}());
exports.default = Color;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var const_1 = __webpack_require__(1);
var enum_1 = __webpack_require__(2);
var toolbar_1 = __webpack_require__(11);
var lasergrid_1 = __webpack_require__(10);
var tile_1 = __webpack_require__(0);
var mirror_1 = __webpack_require__(6);
var swatch_1 = __webpack_require__(7);
var ending_1 = __webpack_require__(5);
var color_1 = __webpack_require__(3);
exports.toolbar = new toolbar_1.default("images/toolbar.png", new tile_1.default(0, 7), 8, 1, draw);
exports.lasergrid = new lasergrid_1.default("images/lasergrid.png", new tile_1.default(0, 0), 7, 7, draw);
exports.pieces = [];
function init() {
    const_1.canvas.addEventListener("mousemove", onMouseMove, false);
    const_1.canvas.addEventListener("click", onClick, false);
    exports.pieces[enum_1.Pieces.ForwardSlash] = new mirror_1.default("images/pieces/mirror_forwardslash.png", enum_1.Direction.East, enum_1.Direction.North, enum_1.Direction.West, enum_1.Direction.South, draw);
    exports.pieces[enum_1.Pieces.BackSlash] = new mirror_1.default("images/pieces/mirror_backslash.png", enum_1.Direction.West, enum_1.Direction.South, enum_1.Direction.East, enum_1.Direction.North, draw);
    exports.pieces[enum_1.Pieces.BlackHole] = new mirror_1.default("images/pieces/mirror_blackhole.png", enum_1.Direction.None, enum_1.Direction.None, enum_1.Direction.None, enum_1.Direction.None, draw);
    exports.pieces[enum_1.Pieces.SideSplit] = new mirror_1.default("images/pieces/mirror_sidesplit.png", enum_1.Direction.East, enum_1.Direction.None, enum_1.Direction.East, enum_1.Direction.SplitNorthSouth, draw);
    exports.pieces[enum_1.Pieces.UpSplit] = new mirror_1.default("images/pieces/mirror_upsplit.png", enum_1.Direction.None, enum_1.Direction.North, enum_1.Direction.SplitEastWest, enum_1.Direction.North, draw);
    exports.pieces[enum_1.Pieces.Blue] = new swatch_1.default("images/pieces/swatch_blue.png", new color_1.default(0, 0, 255), draw);
    exports.pieces[enum_1.Pieces.Red] = new swatch_1.default("images/pieces/swatch_red.png", new color_1.default(255, 0, 0), draw);
    exports.pieces[enum_1.Pieces.Green] = new swatch_1.default("images/pieces/swatch_green.png", new color_1.default(0, 255, 0), draw);
    exports.lasergrid.calculateAllPaths();
    exports.lasergrid.calculateDrawPathWrapper();
}
function draw() {
    const_1.ctx.clearRect(0, 0, const_1.canvas.width, const_1.canvas.height);
    const_1.ctx.fillStyle = '#bcbcbc';
    const_1.ctx.fillRect(0, 0, const_1.canvas.width, const_1.canvas.height);
    exports.lasergrid.draw(const_1.ctx);
    exports.toolbar.draw(const_1.ctx);
}
function onMouseMove(event) {
}
function onClick(event) {
    var loc = windowToCanvas(event.clientX, event.clientY);
    exports.lasergrid.processMouseClick(loc.x, loc.y);
    exports.toolbar.processMouseClick(loc.x, loc.y);
    draw();
}
function importLevel(levelID) {
    if (!levelID)
        return;
    window.fetch("/api/lasergame/" + levelID, {
        method: 'GET',
        credentials: 'same-origin'
    }).then(function (response) {
        return response.json();
    }).then(function (parsedJSON) {
        var tempPathsList = parsedJSON.level_data;
        var newPathsList = [null];
        console.log(tempPathsList);
        for (var i = 1; i <= 20; i++) {
            var arrayOfEndings = tempPathsList[i];
            var newArrayOfEndings = [];
            for (var j = 0; j < arrayOfEndings.length; j++) {
                newArrayOfEndings[j] = ending_1.default.fromJSON(arrayOfEndings[j]);
            }
            newPathsList[i] = newArrayOfEndings;
        }
        exports.lasergrid.importedPathsList = newPathsList;
        logImportPaths();
        logCurrentPaths();
    }).catch(function (err) {
        alert('Import Level Failed!' + err);
    });
}
function logCurrentPaths() {
    logPaths(const_1.pathsPre, exports.lasergrid.paths, exports.lasergrid.importedPathsList);
}
exports.logCurrentPaths = logCurrentPaths;
function logImportPaths() {
    logPaths(const_1.importPre, exports.lasergrid.importedPathsList, exports.lasergrid.paths);
}
exports.logImportPaths = logImportPaths;
function logPaths(element, paths, otherPaths) {
    element.innerHTML = "";
    for (var i = 1; i <= 20; i++) {
        var path = paths[i];
        var line = i + "";
        if (i < 10) {
            line += "  -> ";
        }
        else {
            line += " -> ";
        }
        if (path.length > 1) {
            line += "{" + path[0].toString() + ", ";
            console.log(path.length);
            for (var space = 1; space < path.length - 1; space++) {
                line += path[space].toString() + ", ";
            }
            line += path[path.length - 1].toString() + "}";
        }
        else {
            line += path[0].toString();
        }
        if (otherPaths.length > 0) {
            var equality = true;
            if (otherPaths[i].length === paths[i].length) {
                for (var ei = 0; ei < paths[i].length; ei++) {
                    if (!paths[i][ei].equals(otherPaths[i][ei])) {
                        equality = false;
                        break;
                    }
                }
            }
            else {
                equality = false;
            }
            if (equality) {
                element.innerHTML += "<span style='color: green'>" + line + "</span>";
            }
            else {
                element.innerHTML += "<span style='color: red'>" + line + "</span>";
            }
        }
        else {
            element.innerHTML += line;
        }
        if (i < 20) {
            element.innerHTML += "\n";
        }
    }
}
function windowToCanvas(x, y) {
    var bbox = const_1.canvas.getBoundingClientRect();
    return {
        x: x - bbox.left * (const_1.canvas.width / bbox.width),
        y: y - bbox.top * (const_1.canvas.height / bbox.height)
    };
}
function uploadPaths() {
    window.fetch('/api/lasergame/upload', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify({ level_data: exports.lasergrid.paths, name: "test" })
    }).then(function (response) {
        if (response.status === 401) {
            alert('Must be logged in to upload a level!');
        }
        else {
            alert('Level uploaded! (Probably)');
        }
    });
}
init();


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var enum_1 = __webpack_require__(2);
var color_1 = __webpack_require__(3);
var Ending = (function () {
    function Ending(end, color) {
        this.end = end;
        this.color = color;
    }
    Ending.prototype.toString = function () {
        var string = "";
        string += this.end;
        string += " " + this.color.toName();
        return string;
    };
    Ending.fromJSON = function (ending) {
        if (ending.end === "blocked") {
            return new Ending(enum_1.End.Blocked, color_1.default.fromJSON(ending.color));
        }
        else if (ending.end === "loop") {
            return new Ending(enum_1.End.Loop, color_1.default.fromJSON(ending.color));
        }
        else {
            return new Ending(ending.end, color_1.default.fromJSON(ending.color));
        }
    };
    Ending.prototype.equals = function (otherEnding) {
        return this.end === otherEnding.end && this.color.equals(otherEnding.color);
    };
    Ending.endingFromLogString = function (logString) {
        var end = Number(logString.slice(0, logString.indexOf(" ")));
        var colorString = logString.slice(logString.indexOf(" ") + 1);
        return new Ending(end, color_1.default.colorFromName(colorString));
    };
    return Ending;
}());
exports.default = Ending;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var piece_1 = __webpack_require__(9);
var enum_1 = __webpack_require__(2);
var Mirror = (function (_super) {
    __extends(Mirror, _super);
    function Mirror(src, north, east, south, west, draw) {
        var _this = _super.call(this, src, draw) || this;
        _this.dirs = [];
        _this.dirs[enum_1.Direction.North] = north;
        _this.dirs[enum_1.Direction.East] = east;
        _this.dirs[enum_1.Direction.South] = south;
        _this.dirs[enum_1.Direction.West] = west;
        return _this;
    }
    return Mirror;
}(piece_1.default));
exports.default = Mirror;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var piece_1 = __webpack_require__(9);
var Swatch = (function (_super) {
    __extends(Swatch, _super);
    function Swatch(src, color, draw) {
        var _this = _super.call(this, src, draw) || this;
        _this.color = color;
        return _this;
    }
    return Swatch;
}(piece_1.default));
exports.default = Swatch;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tile_1 = __webpack_require__(0);
var CanvasComponent = (function () {
    function CanvasComponent(src, tile, widthInTiles, heightInTiles, draw, offsetX, offsetY) {
        if (offsetX === void 0) { offsetX = 0; }
        if (offsetY === void 0) { offsetY = 0; }
        this.img = new Image();
        this.img.onload = function () { draw(); };
        this.img.src = src;
        this.tile = tile;
        this.widthInTiles = widthInTiles;
        this.heightInTiles = heightInTiles;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
    }
    CanvasComponent.prototype.draw = function (ctx) {
        var loc = this.tile.toPixels();
        ctx.drawImage(this.img, loc.x + this.offsetX, loc.y + this.offsetY);
    };
    CanvasComponent.prototype.processMouseClick = function (x, y) {
        var relativeTile = tile_1.default.TileFromPixels(x, y).minus(this.tile);
        if (relativeTile.isValid(this.widthInTiles, this.heightInTiles)) {
            return relativeTile;
        }
        return null;
    };
    return CanvasComponent;
}());
exports.default = CanvasComponent;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tile_1 = __webpack_require__(0);
var Piece = (function () {
    function Piece(src, draw) {
        this.tile = new tile_1.default(-1, -1);
        this.img = new Image();
        this.img.onload = function () { draw(); };
        this.img.src = src;
    }
    Piece.prototype.drawAt = function (tile, ctx) {
        var pos = tile.toPixels();
        ctx.drawImage(this.img, pos.x, pos.y);
    };
    return Piece;
}());
exports.default = Piece;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var laser_1 = __webpack_require__(13);
var const_1 = __webpack_require__(1);
var enum_1 = __webpack_require__(2);
var lasergame_1 = __webpack_require__(4);
var canvas_component_1 = __webpack_require__(8);
var tile_1 = __webpack_require__(0);
var mirror_1 = __webpack_require__(6);
var swatch_1 = __webpack_require__(7);
var ending_1 = __webpack_require__(5);
var LaserGrid = (function (_super) {
    __extends(LaserGrid, _super);
    function LaserGrid(src, tile, widthInTiles, heightInTiles, draw, offsetX, offsetY) {
        if (offsetX === void 0) { offsetX = 0; }
        if (offsetY === void 0) { offsetY = 0; }
        var _this = _super.call(this, src, tile, widthInTiles, heightInTiles, draw, offsetX, offsetY) || this;
        _this.grid = [];
        for (var i = 0; i < 5; i++) {
            _this.grid[i] = [];
            for (var j = 0; j < 5; j++) {
                _this.grid[i][j] = null;
            }
        }
        _this.selectedEdge = 1;
        _this.paths = [];
        _this.drawPath = [];
        _this.importedPathsList = [];
        return _this;
    }
    LaserGrid.prototype.draw = function (ctx) {
        _super.prototype.draw.call(this, ctx);
        for (var i = 0; i < const_1.pieces.length; i++) {
            var piece = const_1.pieces[i];
            if (piece.tile.isValid()) {
                piece.drawAt(this.tile.add(piece.tile).add(new tile_1.default(1, 1)), ctx);
            }
        }
        for (var i = 0; i < this.drawPath.length; i++) {
            ctx.beginPath();
            var laser = this.drawPath[i];
            ctx.strokeStyle = laser.color.toRGBString();
            var loc = laser.tile.add(new tile_1.default(1, 1)).toPixels();
            loc.x += const_1.TILE_HALF;
            loc.y += const_1.TILE_HALF;
            ctx.moveTo(loc.x, loc.y);
            var tilemap = const_1.directionMapping[laser.dir];
            ctx.lineTo(loc.x + tilemap.tileX * const_1.TILE_HALF, loc.y + tilemap.tileY * const_1.TILE_HALF);
            ctx.stroke();
        }
    };
    LaserGrid.prototype.processMouseClick = function (x, y) {
        var relativeTile = _super.prototype.processMouseClick.call(this, x, y);
        if (relativeTile !== null) {
            if (relativeTile.compare(new tile_1.default(1, 1), function (v1, v2) { return v1 >= v2; }) && relativeTile.compare(new tile_1.default(5, 5), function (v1, v2) { return v1 <= v2; })) {
                var loc = relativeTile.minus(new tile_1.default(1, 1));
                var piece = this.grid[loc.tileY][loc.tileX];
                if (piece !== null) {
                    this.removePiece(piece);
                }
                else {
                    this.setPiece(lasergame_1.toolbar.getSelectedPiece(), loc);
                }
                this.calculateAllPaths();
                this.calculateDrawPathWrapper();
            }
            var newEdge = LaserGrid.tileToEdgeNumber(relativeTile.add(new tile_1.default(-1, -1)));
            if (newEdge !== 0) {
                this.selectedEdge = newEdge;
            }
            this.calculateDrawPathWrapper();
        }
        return relativeTile;
    };
    LaserGrid.prototype.removePiece = function (piece) {
        if (piece.tile.isValid()) {
            this.grid[piece.tile.tileY][piece.tile.tileX] = null;
            piece.tile = new tile_1.default(-1, -1);
        }
    };
    LaserGrid.prototype.setPiece = function (piece, tile) {
        this.removePiece(piece);
        this.grid[tile.tileY][tile.tileX] = piece;
        piece.tile = tile;
    };
    LaserGrid.prototype.getPiece = function (tile) {
        return this.grid[tile.tileY][tile.tileX];
    };
    LaserGrid.prototype.calculateAllPaths = function () {
        this.paths = [];
        for (var edge = 1; edge <= 20; edge++) {
            this.calculatePath(edge, LaserGrid.edgeNumberToLaser(edge));
        }
        lasergame_1.logCurrentPaths();
        if (this.importedPathsList.length > 0) {
            lasergame_1.logImportPaths();
        }
    };
    LaserGrid.prototype.calculatePath = function (edge, laser) {
        for (var i = 0; i < 100; i++) {
            laser.tile = laser.tile.nextTile(laser.dir);
            if (!laser.tile.isValid(5, 5)) {
                var endEdge = LaserGrid.tileToEdgeNumber(laser.tile);
                this.addEndingToPaths(edge, new ending_1.default(endEdge, laser.color));
                return;
            }
            var piece = this.getPiece(laser.tile);
            if (piece) {
                if (piece instanceof mirror_1.default) {
                    laser.dir = piece.dirs[laser.dir];
                    switch (laser.dir) {
                        case enum_1.Direction.SplitNorthSouth:
                            laser.dir = enum_1.Direction.North;
                            this.calculatePath(edge, new laser_1.default(laser.tile, enum_1.Direction.South, laser.color));
                            break;
                        case enum_1.Direction.SplitEastWest:
                            laser.dir = enum_1.Direction.East;
                            this.calculatePath(edge, new laser_1.default(laser.tile, enum_1.Direction.West, laser.color));
                            break;
                        case enum_1.Direction.None:
                            this.addEndingToPaths(edge, new ending_1.default(enum_1.End.Blocked, laser.color));
                            return;
                    }
                }
                else if (piece instanceof swatch_1.default) {
                    laser.color = laser.color.add(piece.color);
                }
            }
        }
        this.addEndingToPaths(edge, new ending_1.default(enum_1.End.Loop, laser.color));
    };
    LaserGrid.prototype.calculateDrawPathWrapper = function () {
        this.drawPath = [];
        this.calculateDrawPath(LaserGrid.edgeNumberToLaser(this.selectedEdge));
    };
    LaserGrid.prototype.calculateDrawPath = function (laser) {
        for (var i = 0; i < 100; i++) {
            laser.tile = laser.tile.nextTile(laser.dir);
            if (!laser.tile.isValid(5, 5)) {
                return;
            }
            var piece = this.getPiece(laser.tile);
            this.drawPath.push(laser.getOppositeLaser());
            if (piece) {
                if (piece instanceof mirror_1.default) {
                    laser.dir = piece.dirs[laser.dir];
                    switch (laser.dir) {
                        case enum_1.Direction.SplitNorthSouth:
                            laser.dir = enum_1.Direction.North;
                            this.drawPath.push(laser.getOppositeLaser());
                            this.calculateDrawPath(new laser_1.default(laser.tile, enum_1.Direction.South, laser.color));
                            break;
                        case enum_1.Direction.SplitEastWest:
                            laser.dir = enum_1.Direction.East;
                            this.drawPath.push(laser.getOppositeLaser());
                            this.calculateDrawPath(new laser_1.default(laser.tile, enum_1.Direction.West, laser.color));
                            break;
                        case enum_1.Direction.None:
                            return;
                    }
                }
                else if (piece instanceof swatch_1.default) {
                    laser.color = laser.color.add(piece.color);
                }
            }
            this.drawPath.push(laser.copy());
        }
    };
    LaserGrid.prototype.addEndingToPaths = function (edge, ending) {
        if (!this.paths[edge]) {
            this.paths[edge] = [];
        }
        this.paths[edge].push(ending);
    };
    LaserGrid.edgeNumberToLaser = function (edge) {
        if (edge < 6) {
            return new laser_1.default(new tile_1.default(edge - 1, -1), enum_1.Direction.South);
        }
        else if (edge < 11) {
            return new laser_1.default(new tile_1.default(5, edge - 6), enum_1.Direction.West);
        }
        else if (edge < 16) {
            return new laser_1.default(new tile_1.default(-edge + 15, 5), enum_1.Direction.North);
        }
        else if (edge < 21) {
            return new laser_1.default(new tile_1.default(-1, -edge + 20), enum_1.Direction.East);
        }
    };
    LaserGrid.tileToEdgeNumber = function (tile) {
        var x = tile.tileX;
        var y = tile.tileY;
        if (y === -1 && x > -1 && x < 5) {
            return 1 + x;
        }
        else if (x === 5 && y > -1 && y < 5) {
            return 6 + y;
        }
        else if (y === 5 && x > -1 && x < 5) {
            return 15 - x;
        }
        else if (x === -1 && y > -1 && y < 5) {
            return 20 - y;
        }
        return 0;
    };
    return LaserGrid;
}(canvas_component_1.default));
exports.default = LaserGrid;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var lasergame_1 = __webpack_require__(4);
var const_1 = __webpack_require__(1);
var tile_1 = __webpack_require__(0);
var canvas_component_1 = __webpack_require__(8);
var Toolbar = (function (_super) {
    __extends(Toolbar, _super);
    function Toolbar(src, tile, widthInTiles, heightInTiles, draw, offsetX, offsetY) {
        if (offsetX === void 0) { offsetX = 0; }
        if (offsetY === void 0) { offsetY = 0; }
        var _this = _super.call(this, src, tile, widthInTiles, heightInTiles, draw, offsetX, offsetY) || this;
        _this.selectedPiece = 0;
        return _this;
    }
    Toolbar.prototype.draw = function (ctx) {
        _super.prototype.draw.call(this, ctx);
        for (var i = 0; i < lasergame_1.pieces.length; i++) {
            lasergame_1.pieces[i].drawAt(this.tile.add(new tile_1.default(i, 0)), ctx);
        }
        ctx.fillStyle = "green";
        ctx.globalAlpha = 0.2;
        var loc = new tile_1.default(this.tile.add(new tile_1.default(this.selectedPiece, 0)).tileX, this.tile.tileY).toPixels();
        ctx.fillRect(loc.x, loc.y, const_1.TILE_FULL, const_1.TILE_FULL);
        ctx.globalAlpha = 1;
        ctx.fillStyle = "red";
        ctx.globalAlpha = 0.2;
        for (var i = 0; i < lasergame_1.pieces.length; i++) {
            var piece = lasergame_1.pieces[i];
            if (i !== this.selectedPiece && piece.tile.isValid()) {
                var loc_1 = new tile_1.default(this.tile.add(new tile_1.default(i, 0)).tileX, this.tile.tileY).toPixels();
                ctx.fillRect(loc_1.x, loc_1.y, const_1.TILE_FULL, const_1.TILE_FULL);
            }
        }
        ctx.globalAlpha = 1.0;
    };
    Toolbar.prototype.processMouseClick = function (x, y) {
        var relativeTile = _super.prototype.processMouseClick.call(this, x, y);
        if (relativeTile !== null) {
            this.selectedPiece = relativeTile.tileX;
        }
        return relativeTile;
    };
    Toolbar.prototype.getSelectedPiece = function () {
        return lasergame_1.pieces[this.selectedPiece];
    };
    return Toolbar;
}(canvas_component_1.default));
exports.default = Toolbar;


/***/ }),
/* 12 */,
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var const_1 = __webpack_require__(1);
var color_1 = __webpack_require__(3);
var Laser = (function () {
    function Laser(tile, dir, color) {
        if (color === void 0) { color = new color_1.default(); }
        this.tile = tile;
        this.dir = dir;
        this.color = color;
    }
    Laser.prototype.getOppositeLaser = function () {
        return new Laser(this.tile.copy(), const_1.oppositeDirection[this.dir], this.color.copy());
    };
    Laser.prototype.copy = function () {
        return new Laser(this.tile.copy(), this.dir, this.color.copy());
    };
    return Laser;
}());
exports.default = Laser;


/***/ })
/******/ ]);