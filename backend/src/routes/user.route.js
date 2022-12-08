const express = require("express");
const {
  checkLogIn,
  createVisitor,
  createMember,
} = require("../controllers/user.controller");
const { verifyUser } = require("../middleware/apiKey");

// eslint-disable-next-line new-cap
const router = express.Router();

router.route("/").get(checkLogIn);

router.route("/visitor").post(createVisitor);

router.route("/member").post(createMember);

router.route("/").post(verifyUser(false), (req, res) => {
  res.status(202).json({
    message: `APIKey ${
      res.locals.authenticated ? "verified" : "not verified"
    }!`,
  });
});

module.exports = router;
