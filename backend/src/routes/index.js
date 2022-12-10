const express = require("express");
const userRoutes = require("./user.route");
const productRoutes = require("./products.route");
const orderRoutes = require("./orders.route");
const swaggerUi = require("swagger-ui-express");
const supplierRoutes = require("./supplier.route");
const YAML = require('yamljs');
const swaggerDocument = YAML.load('backend/src/utils/swagger.yml');

// eslint-disable-next-line new-cap
const router = express.Router();

router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);
router.use("/supplier", supplierRoutes);

router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = router;
