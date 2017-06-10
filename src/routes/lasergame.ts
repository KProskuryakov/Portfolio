import express = require('express');
let router = express.Router();

/* GET lasergame listing. */
router.get('/', function (req, res) {
  res.render('lasergame', { page: "Laser Game" });
});

router.get('/random', (req, res) => {
  res.redirect('/lasergame/' + Date.now());
});

router.get('/daily', (req, res) => {
  res.render('lasergame', { page: "Laser Game", daily: true });
});

router.get('/:seed', (req, res) => {
  res.render('lasergame', { page: "Laser Game", seed: req.params.seed });
});

module.exports = router;
