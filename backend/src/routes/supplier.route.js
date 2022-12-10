const express = require("express");
const { checkLogIn } = require("../controllers/supplier.controller");
const { verifyUser } = require("../middleware/apiKey");

// eslint-disable-next-line new-cap
const router = express.Router();

router.route("/").get(checkLogIn);

router.route("/").post(verifyUser(false), (req, res) => {
  res.status(202).json({
    message: `APIKey ${
      res.locals.authenticated ? "verified" : "not verified"
    }!`,
  });
});

module.exports = router;
