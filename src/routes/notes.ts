/**
 * Created by kosty on 3/23/2017.
 */
import express = require('express');
let router = express.Router();

import { readdir } from 'fs';

let notesList: string[] = [];
readdir('./notes', function(err, files) {
    if (err) {
        console.log(err);
        return;
    }
    for (let i = 0; i < files.length; i++) {
        let file = files[i];
        notesList.push(file.slice(0, file.indexOf('.')));
    }
});

router.get('/', function(req, res, next) {
    res.render('notes', {notesList: notesList, title: 'Notes'});
});

router.get('/:note', function(req, res, next) {
    res.render('notes/' + req.params.note, {title: req.params.note});
});

module.exports = router;