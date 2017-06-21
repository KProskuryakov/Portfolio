import express = require('express')
let router = express.Router()

/* GET lasergame listing. */
router.get('/', function (req, res) {
  res.render('lasergame', { title: 'Lasergame', page: "Lasergame" })
})

router.get('/random/:difficulty', (req, res) => {
  res.redirect(`/lasergame/seed/${req.params.difficulty}/${Date.now()}`)
})

router.get('/daily', (req, res) => {
  res.render('lasergame', { title: 'Lasergame', page: "Lasergame", daily: true })
})

router.get('/how-to-play', (req, res) => {
  res.render('lasergame/how-to-play', {title: 'How To Play', page: "Lasergame" })
})

router.get('/seed/:difficulty/:seed', (req, res) => {
  res.render('lasergame', { title: 'Lasergame', page: "Lasergame", difficulty: req.params.difficulty, seed: req.params.seed })
})

module.exports = router
