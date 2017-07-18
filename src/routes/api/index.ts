/**
 * Route: /api/
 */

import express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("api/index", { title: "API", page: "API" });
});

module.exports = router;
