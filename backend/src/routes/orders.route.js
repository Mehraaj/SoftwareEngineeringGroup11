const express = require("express");
const {
  fetchTax,
  handleOrder,
  fetchCart,
  updateCart,
  fetchOrders,
  fetchOrderByID,
  createPayment,
} = require("../controllers/orders.controller");
const { verifyUser } = require("../middleware/apiKey");

// eslint-disable-next-line new-cap
const router = express.Router();

/**
 * Create order (paid for and shipped)
 */
router
  .route("/")
  .get(verifyUser(true), fetchOrders)
  .post(verifyUser(false), handleOrder);

router.route("/details/:orderNumber").get(verifyUser(true), fetchOrderByID);

router
  .route("/cart")
  .get(verifyUser(true), fetchCart)
  .post(verifyUser(true), updateCart);

router.route("/payment/:orderNumber").post(verifyUser(false), createPayment);

router.route("/tax/:state").get(fetchTax);

module.exports = router;
