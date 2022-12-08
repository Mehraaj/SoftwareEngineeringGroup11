const express = require("express");
const userRoutes = require("./user.route");
const productRoutes = require("./products.route");
const orderRoutes = require("./orders.route");

// eslint-disable-next-line new-cap
const router = express.Router();

router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);

module.exports = router;
