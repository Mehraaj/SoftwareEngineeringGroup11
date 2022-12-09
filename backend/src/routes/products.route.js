const express = require("express");
const {
  fetchCatalog,
  fetchCatalogById,
} = require("../controllers/products.controller");
const { verifyUser } = require("../middleware/apiKey");

// eslint-disable-next-line new-cap
const router = express.Router();

router.route("/productCatalog").get(verifyUser(false), fetchCatalog);

router.route("/productCatalog/:id").get(fetchCatalogById);

module.exports = router;
