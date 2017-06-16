import express = require('express')
let router = express.Router()

/* GET lasergame listing. */
router.get('/', function (req, res) {
  res.render('lasergame', { title: 'Lasergame', page: "Lasergame" })
})

router.get('/random', (req, res) => {
  res.redirect('/lasergame/seed/' + Date.now())
})

router.get('/daily', (req, res) => {
  res.render('lasergame', { title: 'Lasergame', page: "Lasergame", daily: true })
})

router.get('/seed/:seed', (req, res) => {
  res.render('lasergame', { title: 'Lasergame', page: "Lasergame", seed: req.params.seed })
})

module.exports = router
