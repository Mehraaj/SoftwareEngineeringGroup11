const { v4: uuidv4 } = require("uuid");
const logger = require("../utils/logger");
const query = require("../utils/mysql");
const STATUS = require("http-status");
const tax = require("sales-tax");

const fetchTax = async (req, res) => {
  // #swagger.tags = ['Orders']
  try {
    const { state } = req.params;
    const taxRate = await tax.getSalesTax("US", state);
    res.status(STATUS.OK).json(taxRate);
  } catch (error) {
    logger.error(error);
    res.status(STATUS.INTERNAL_SERVER_ERROR).json(error);
  }
};

const fetchOrders = async (req, res) => {
  // #swagger.tags = ['Orders']
  const { vid } = req.user;
  try {
    const orders = await query(
      `select state, orderNumber, date,  sum(quantity * Price) as cost from trinityfashion.orders
      natural join trinityfashion.productCatalog
      where VID = ?
      group by orderNumber, date, state;`,
      [vid]
    );
    logger.debug(JSON.stringify(orders));
    await Promise.all(
      orders.map(async (order) => {
        const taxRate = await tax.getSalesTax("US", order.state);
        const taxTotal = taxRate.rate * order.cost;
        order.cost = Number(order.cost) + Number(taxTotal);
        order.date = new Date(order.date).toLocaleString();
        return order;
      })
    );
    res.status(STATUS.OK).json(orders);
  } catch (error) {
    logger.error(error);
    res.status(STATUS.INTERNAL_SERVER_ERROR).json(error);
  }
};

const fetchOrderByID = async (req, res) => {
  // #swagger.tags = ['Orders']
  const { vid } = req.user;
  const { orderNumber } = req.params;
  try {
    const orders = await query(
      `select *, quantity * price as itemTotal from trinityfashion.orders 
      natural join trinityfashion.productCatalog
      where VID = ? and orderNumber = ?;`,
      [vid, orderNumber]
    );
    logger.debug(JSON.stringify(orders));
    await Promise.all(
      orders.map((order) => {
        order.date = new Date(order.date).toLocaleString();
        order.Price = Number(order.Price);
        order.itemTotal = Number(order.itemTotal);
        return order;
      })
    );
    const subTotal = orders.reduce((acc, order) => {
      return acc + order.itemTotal;
    }, 0);
    const taxRate = await tax.getSalesTax("US", orders[0].state);
    const taxTotal = taxRate.rate * subTotal;
    const grandTotal = subTotal + taxTotal;

    res.status(STATUS.OK).json({
      orders,
      subTotal,
      taxTotal,
      grandTotal,
    });
  } catch (error) {
    logger.error(error);
    res.status(STATUS.INTERNAL_SERVER_ERROR).json(error);
  }
};

const handleOrder = async (req, res) => {
  // #swagger.tags = ['Orders']
  const { state } = req.query;
  const { cart } = req.cookies;
  const { vid } = req.user;
  logger.debug(cart);
  const date = new Date();
  const orderNum = uuidv4();
  try {
    await Promise.all(
      JSON.parse(cart).map(async (order) => {
        const { PID, color, Size, quantity } = order;
        await query(
          "INSERT INTO trinityfashion.orders VALUES (?, ?, ?, ?, ?, ?, ?, ?);",
          [vid, PID, color, Size, quantity, orderNum, state, date]
        );
      })
    );
    res.clearCookie("cart");
    res.status(STATUS.OK).json({ orderNum, date, cart: JSON.parse(cart) });
  } catch (error) {
    logger.error(error);
    res.status(STATUS.INTERNAL_SERVER_ERROR).json(error);
  }
};

const updateCart = async (req, res) => {
  // #swagger.tags = ['Orders']
  const { cart } = req.cookies;
  const { vid } = req.user;

  query("DELETE FROM trinityfashion.Cart WHERE vid = ?;", [vid]);

  try {
    await Promise.all(
      JSON.parse(cart).map(async (order) => {
        const { PID, color, Size } = order;
        await query("INSERT INTO trinityfashion.Cart VALUES (?, ?, ?, ?);", [
          vid,
          PID,
          Size,
          color,
        ]);
      })
    );
    res.status(STATUS.OK).json({ cart: JSON.parse(cart) });
  } catch (error) {
    logger.error(error);
    res.status(STATUS.INTERNAL_SERVER_ERROR).json(error);
  }
};

const fetchCart = async (req, res) => {
  // #swagger.tags = ['Orders']
  const { vid } = req.user;
  logger.debug(`Fetching cart for user: ${vid}`);
  try {
    const cart = await getCart(vid);
    res.cookie("cart", JSON.stringify(cart));
    res.status(STATUS.OK).json(cart);
  } catch (error) {
    logger.error(error);
    res.status(STATUS.INTERNAL_SERVER_ERROR).json(error);
  }
};

const getCart = async (vid) => {
  // #swagger.tags = ['Orders']
  try {
    const cart = await query(
      "SELECT * FROM trinityfashion.Cart WHERE vid = ?;",
      [vid]
    );
    cart.map((item) => {
      item["quantity"] = 1;
    });
    return cart;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

module.exports = {
  fetchTax,
  fetchOrders,
  fetchOrderByID,
  handleOrder,
  getCart,
  fetchCart,
  updateCart,
};
