const express = require("express");

// eslint-disable-next-line new-cap
const router = express.Router();

router.route("/").get((req, res) => {
  // login
  res.send("Hello World!");
});

router.route("/checkout").post((req, res) => {
  res.send("Hello Visitor!");
});

router.route("/order").get((req, res) => {
  res.send("Hello Member!");
});

module.exports = router;
