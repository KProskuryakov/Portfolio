import express = require("express");
const router = express.Router();

import passport = require("../passport");

router.get("/", (req, res) => {
  if (req.user) {
    res.send("woo!");
  } else {
    res.status(401).send("Not logged in!");
  }
});

export default router;
