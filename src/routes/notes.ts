/**
 * Created by kosty on 3/23/2017.
 */
import express = require('express')
let router = express.Router()

router.get('/:note', function (req, res, next) {
  res.render('notes/' + req.params.note, { title: req.params.note, page: 'Notes' })
})

module.exports = router