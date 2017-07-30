import express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", (req, res) => {
  res.render("index", { title: "Home", page: "Home" });
});

export default router;
