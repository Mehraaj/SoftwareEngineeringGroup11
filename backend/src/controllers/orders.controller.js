const { v4: uuidv4 } = require("uuid");
const logger = require("../utils/logger");
const query = require("../utils/mysql");
const STATUS = require("http-status");
const tax = require("sales-tax");
const retry = require("async-retry");
const convert = require("color-convert");
const { jsPDF } = require("jspdf");
require("jspdf-autotable");
const { nanoid } = require("nanoid");
const { validatePaymentPayload } = require("../utils/schema");
const { ApiError, client: square } = require("../utils/square");
const logo = require("../../../src/resources/homepage/logo.js");
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
  // #swagger.summary = 'Get specific order details'
  const { vid } = req.user;
  const { orderNumber } = req.params;
  try {
    res.status(STATUS.OK).json(await calculateOrderDetails(vid, orderNumber));
  } catch (error) {
    logger.error("Could not fetch order details");
    res
      .status(STATUS.INTERNAL_SERVER_ERROR)
      .send("Could not fetch order details");
  }
};

const handleOrder = async (req, res) => {
  // #swagger.tags = ['Orders']
  // #swagger.summary = 'Handles order placement and payment'
  const { state } = req.query;
  console.log("State from request:");
  console.log(state);
  const cart = req.body;

  let vid;
  if (res.locals["authenticated"] === false) {
    logger.debug("Placing order as guest");
    vid = await createVisitor();
  } else {
    vid = req.user.vid;
  }
  const date = new Date();
  const orderNum = uuidv4();
  try {
    await Promise.all(
      cart.map(async (order) => {
        const { PID, color, Size, quantity } = order;
        await query(
          "INSERT INTO trinityfashion.orders VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);",
          [vid, PID, quantity, color, Size, orderNum, state, date, null]
        );
      })
    );
    res.status(STATUS.OK).json({ orderNum, date, cart });
  } catch (error) {
    logger.error(error);
    res.status(STATUS.INTERNAL_SERVER_ERROR).json(error);
  }
};

const updateCart = async (req, res) => {
  // #swagger.tags = ['Orders']

  const cart = req.body;
  const { vid } = req.user;

  query("DELETE FROM trinityfashion.Cart WHERE vid = ?;", [vid]);

  try {
    await Promise.all(
      cart.map(async (order) => {
        const { PID, color, Size, image, quantity } = order;
        await query(
          "INSERT INTO trinityfashion.Cart VALUES (?, ?, ?, ?, ?, ?);",
          [vid, PID, quantity, Size, color, image]
        );
      })
    );
    res.status(STATUS.OK).json({ cart: cart });
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
      "SELECT cart.PID, cart.quantity, cart.size as Size, cart.color, cart.image, products.name as ProductName, products.price FROM trinityfashion.Cart as cart inner join trinityfashion.productCatalog as products ON cart.PID = products.PID WHERE VID = ?;",
      [vid]
    );

    return cart;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

const createVisitor = async () => {
  const vid = uuidv4();
  logger.debug(`Creating visitor: ${vid}`);
  await query("INSERT INTO trinityfashion.Visitor (VID) VALUES (?);", [vid]);
  return vid;
};

const createPayment = async (req, res) => {
  const payload = req.body;
  const orderNumber = req.params.orderNumber;

  if (!orderNumber) {
    res.status(STATUS.BAD_REQUEST).send("Missing order number");
    return;
  }
  if (!validatePaymentPayload(payload)) {
    res.status(STATUS.BAD_REQUEST).send("Invalid payload");
    return;
  }

  const { grandTotal } = await calculateOrderDetails(null, orderNumber);
  const cents = Math.trunc(grandTotal * 100);

  await retry(async (bail, attempt) => {
    try {
      logger.debug("Creating payment", { attempt });

      const idempotencyKey = payload.idempotencyKey || nanoid();
      const payment = {
        idempotencyKey,
        locationId: payload.locationId,
        sourceId: payload.sourceId,
        amountMoney: {
          amount: cents,
          currency: "USD",
        },
      };

      if (payload.customerId) {
        payment.customerId = payload.customerId;
      }

      if (payload.verificationToken) {
        payment.verificationToken = payload.verificationToken;
      }

      const { result, statusCode } = await square.paymentsApi.createPayment(
        payment
      );

      logger.info("Payment succeeded!", { result, statusCode });

      await query(
        "UPDATE trinityfashion.orders SET transactionId = ? WHERE orderNumber = ?;",
        [result.payment.id, orderNumber]
      );

      res.status(STATUS.OK).json({
        success: true,
        payment: {
          id: result.payment.id,
          status: result.payment.status,
          receiptUrl: result.payment.receiptUrl,
          orderId: result.payment.orderId,
        },
      });
    } catch (ex) {
      if (ex instanceof ApiError) {
        logger.error(ex.errors);
        bail(ex);
      } else {
        logger.error(`Error creating payment on attempt ${attempt}: ${ex}`);
      }
    }
  });
};

const calculateOrderDetails = async (vid, orderNumber) => {
  const sql = `select *, quantity * price as itemTotal from trinityfashion.orders 
  natural join trinityfashion.productCatalog
  where orderNumber = ? ${vid !== null ? "and VID = ?" : ""};`;
  logger.debug(sql);

  const orders = await query(sql, [orderNumber, vid]);

  if (orders.length === 0) {
    throw new Error("No matching orders found");
  }

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

  return {
    items: orders,
    subTotal,
    taxTotal,
    grandTotal,
  };
};

const generateOrderReceipt = async (req, res) => {
  // const { vid } = req.user;
  const orderNumber = req.params.orderNumber;

  const details = await calculateOrderDetails(null, orderNumber);

  const body = details.items.map((item, idx) => {
    return [
      idx + 1,
      item.Name,
      item.Size,
      undefined,
      item.quantity,
      `$${item.Price.toFixed(2)}`,
      `$${item.itemTotal.toFixed(2)}`,
    ];
  });
  const colors = details.items.map((item) => item.color);

  const doc = new jsPDF();

  const filename = `order-${orderNumber}.pdf`;
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="' + filename + '"'
  );
  res.setHeader("Content-Type", "application/pdf");
  doc.setFont("cambria");
  doc.setFontSize(20);
  doc.addImage(logo, doc.internal.pageSize.getWidth() / 2 - 60, 10, 120, 30);
  doc.text(`Order: ${orderNumber}`, 10, 60);
  doc.autoTable({
    startY: 70,
    head: [
      ["#", "Item", "Size", "Color", "Quantity", "Unit Price", "Total Price"],
    ],
    body,
    didDrawCell: (data) => {
      if (data.section === "body" && data.column.index === 3) {
        doc.setFillColor(...convert.keyword.rgb(colors[data.row.index]));
        doc.setDrawColor(0, 0, 0);
        doc.rect(data.cell.x + 5, data.cell.y + 2, 2, 2, "FD");
      }
    },
  });

  const offset = doc.lastAutoTable.finalY + 30;
  doc.setFontSize(16);
  doc.text(`Subtotal: $${details.subTotal.toFixed(2)}`, 10, offset);
  doc.text(`Tax: $${details.taxTotal.toFixed(2)}`, 10, offset + 10);
  doc.text(`Grand Total: $${details.grandTotal.toFixed(2)}`, 10, offset + 20);

  const arraybuffer = doc.output("arraybuffer");
  res.write(new Uint8Array(arraybuffer));
  res.end();
};

module.exports = {
  fetchTax,
  fetchOrders,
  fetchOrderByID,
  handleOrder,
  getCart,
  fetchCart,
  updateCart,
  createPayment,
  generateOrderReceipt,
};
