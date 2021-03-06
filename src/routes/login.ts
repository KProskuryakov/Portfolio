import express = require("express");
const router = express.Router();

import passport = require("../kp-passport");

router.get("/", (req, res) => {
  const err = req.query.err;
  res.render("login", { title: "Login", page: "Login", err });
});

router.post("/", passport.authenticate("local", { successRedirect: "/", failureRedirect: "/login?err=INVALID" }));

export default router;
