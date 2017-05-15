"use strict";

import { canvas, importPre, pathsPre, ctx} from './const';
import { Direction, End, Pieces } from './enum';
import { PathsList } from './interfaces'
import Toolbar from './classes/toolbar';
import LaserGrid from './classes/lasergrid';
import Tile from './classes/tile';
import Piece from './classes/piece';
import Mirror from './classes/mirror';
import Swatch from './classes/swatch';
import Ending from './classes/ending';
import Color from './classes/color';

export const toolbar = new Toolbar("images/toolbar.png", new Tile(0, 7), 8, 1, draw);
export const lasergrid = new LaserGrid("images/lasergrid.png", new Tile(0, 0), 7, 7, draw);

export const pieces: Array<Piece | Swatch> = [];

/**
 * Inits the things that aren't constants
 */
function init() {
    canvas.addEventListener("mousemove", onMouseMove, false);
    canvas.addEventListener("click", onClick, false);

    pieces[Pieces.ForwardSlash] = new Mirror("images/pieces/mirror_forwardslash.png", Direction.East, Direction.North, Direction.West, Direction.South, draw);
    pieces[Pieces.BackSlash] = new Mirror("images/pieces/mirror_backslash.png", Direction.West, Direction.South, Direction.East, Direction.North, draw);
    pieces[Pieces.BlackHole] = new Mirror("images/pieces/mirror_blackhole.png", Direction.None, Direction.None, Direction.None, Direction.None, draw);
    pieces[Pieces.SideSplit] = new Mirror("images/pieces/mirror_sidesplit.png", Direction.East, Direction.None, Direction.East, Direction.SplitNorthSouth, draw);
    pieces[Pieces.UpSplit] = new Mirror("images/pieces/mirror_upsplit.png", Direction.None, Direction.North, Direction.SplitEastWest, Direction.North, draw);

    pieces[Pieces.Blue] = new Swatch("images/pieces/swatch_blue.png", new Color(0, 0, 255), draw);
    pieces[Pieces.Red] = new Swatch("images/pieces/swatch_red.png", new Color(255, 0, 0), draw);
    pieces[Pieces.Green] = new Swatch("images/pieces/swatch_green.png", new Color(0, 255, 0), draw);

    lasergrid.calculateAllPaths(); // has to be done here to make sure everything is made
    lasergrid.calculateDrawPathWrapper();
}

/**
 * Draws all the things
 */
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#bcbcbc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    lasergrid.draw(ctx);
    toolbar.draw(ctx);
}

function onMouseMove(event: any) {
    //console.log("Moved here: x" + event.clientX + ", y: " + event.clientY);
}

function onClick(event: any) {
    //console.log("Clicked here: x" + event.clientX + ", y: " + event.clientY);
    let loc = windowToCanvas(event.clientX, event.clientY);
    lasergrid.processMouseClick(loc.x, loc.y);
    toolbar.processMouseClick(loc.x, loc.y);
    draw();
}

// TODO delete importHiddenData() when all tidied up
// function importHiddenData() {
//     if (hiddenData.innerHTML !== "") {
//         let leveldata = JSON.parse(hiddenData.innerHTML);
//         let tempPathsList = leveldata.level;
//         let newPathsList: PathsList = [null];
//         console.log(tempPathsList);
//         for (let i = 1; i <= 20; i++) {

//             let arrayOfEndings = tempPathsList[i];
//             let newArrayOfEndings = [];
//             for (let j = 0; j < arrayOfEndings.length; j++) {
//                 newArrayOfEndings[j] = Ending.fromJSON(arrayOfEndings[j]);
//             }
//             newPathsList[i] = newArrayOfEndings;
//         }

//         lasergrid.importedPathsList = newPathsList;

//         logImportPaths();
//         logCurrentPaths();
//     }
// }

function importLevel(levelID: number) {
    if (!levelID) return;
    window.fetch(`/api/lasergame/${levelID}`, {
        method: 'GET',
        credentials: 'same-origin'
    }).then(function (response) {
        return response.json();
    }).then(function (parsedJSON) {
        let tempPathsList = parsedJSON.level_data;
        let newPathsList: PathsList = [null];
        console.log(tempPathsList);
        for (let i = 1; i <= 20; i++) {

            let arrayOfEndings = tempPathsList[i];
            let newArrayOfEndings = [];
            for (let j = 0; j < arrayOfEndings.length; j++) {
                newArrayOfEndings[j] = Ending.fromJSON(arrayOfEndings[j]);
            }
            newPathsList[i] = newArrayOfEndings;
        }

        lasergrid.importedPathsList = newPathsList;

        logImportPaths();
        logCurrentPaths();
    }).catch(function (err) {
        alert('Import Level Failed!' + err); //TODO better error handling here
    });
}

// delete importButtonPress() when all tidied up
// function importButtonPress() {
//     let textareastuff = (<HTMLTextAreaElement>textArea).value.split("\n");
//     if (textareastuff.length !== 20) {
//         alert("There need to be 20 lines!");
//         return;
//     }
//     let pathsList = [];
//     for (let i = 0; i < 20; i++) {
//         let path = textareastuff[i].slice(6);
//         if (path.charAt(0) === "{") {
//             let endingsList = path.split(", ");
//             endingsList[0] = endingsList[0].slice(1);
//             endingsList[endingsList.length - 1] = endingsList[endingsList.length - 1].slice(0, endingsList[endingsList.length - 1].length - 1);
//             pathsList[i+1] = [];
//             for (let j = 0; j < endingsList.length; j++) {
//                 pathsList[i+1].push(Ending.endingFromLogString(endingsList[j]));
//             }
//         } else {
//             pathsList[i+1] = [Ending.endingFromLogString(path)];
//         }
//     }
//     console.log(pathsList);
//     lasergrid.importedPathsList = pathsList;
//     logCurrentPaths();
//     logImportPaths();
// }

export function logCurrentPaths() {
    logPaths(pathsPre, lasergrid.paths, lasergrid.importedPathsList);
}

export function logImportPaths() {
    logPaths(importPre, lasergrid.importedPathsList, lasergrid.paths);
}

function logPaths(element: HTMLElement, paths: PathsList, otherPaths: PathsList) {
    element.innerHTML = "";
    for (let i = 1; i <= 20; i++) {
        let path = paths[i];
        let line = i + "";
        if (i < 10) {
            line += "  -> ";
        } else {
            line += " -> ";
        }
        if (path.length > 1) {
            line += "{" + path[0].toString() + ", ";
            console.log(path.length);
            for (let space = 1; space < path.length - 1; space++) {
                line += path[space].toString() + ", ";
            }
            line += path[path.length - 1].toString() + "}";
        } else {
            line += path[0].toString();
        }
        if (otherPaths.length > 0) {
            let equality = true;
            if (otherPaths[i].length === paths[i].length) {
                for (let ei = 0; ei < paths[i].length; ei++) {
                    if (!paths[i][ei].equals(otherPaths[i][ei])) {
                        equality = false;
                        break;
                    }
                }
            } else {
                equality = false;
            }
            if (equality) {
                element.innerHTML += "<span style='color: green'>" + line + "</span>";
            } else {
                element.innerHTML += "<span style='color: red'>" + line + "</span>";
            }

        } else {
            element.innerHTML += line;
        }

        if (i < 20) {
            element.innerHTML += "\n";
        }
    }
}

/**
 * Converts the x, y pixel coordinates from window position to relative canvas position
 * @param {number} x clientX
 * @param {number} y clientY
 * @returns {{x: number, y: number}} a relative location to the canvas
 */
function windowToCanvas(x: number, y: number) {
    let bbox = canvas.getBoundingClientRect();

    return {
        x: x - bbox.left * (canvas.width / bbox.width),
        y: y - bbox.top * (canvas.height / bbox.height)
    };
}

function uploadPaths() {
    window.fetch('/api/lasergame/upload', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify({ level_data: lasergrid.paths, name: "test" })
    }).then(function (response) {
        if (response.status === 401) {
            alert('Must be logged in to upload a level!');
        } else {
            alert('Level uploaded! (Probably)');
        }
    });
}

init();
