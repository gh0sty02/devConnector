const express = require("express");
const router = express.Router();

router.get("/", (req, res) => res.send("Posts endpoint"));

module.exports = router;
