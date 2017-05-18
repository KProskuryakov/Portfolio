"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var router = express.Router();
var fs_1 = require("fs");
var notesList = [];
fs_1.readdir('./notes', function (err, files) {
    if (err) {
        console.log(err);
        return;
    }
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        notesList.push(file.slice(0, file.indexOf('.')));
    }
});
router.get('/', function (req, res, next) {
    res.render('notes', { notesList: notesList, title: 'Notes' });
});
router.get('/:note', function (req, res, next) {
    res.render('notes/' + req.params.note, { title: req.params.note });
});
module.exports = router;
