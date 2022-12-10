const { v4: uuidv4 } = require("uuid");
const logger = require("../utils/logger");
const query = require("../utils/mysql");
const STATUS = require("http-status");
const { getCart } = require("./orders.controller");
const emailValidator = require("deep-email-validator");

const checkLogIn = async (req, res) => {
  // #swagger.tags = ['Users']
  const { username, password } = req.query;

  if (!username || !password) {
    res.status(STATUS.BAD_REQUEST).send("Invalid Username and Password");
    return;
  }

  let queryResult;
  try {
    queryResult = await query(
      "select * from trinityfashion.Member where username = ? and password = ?;",
      [username, password]
    );
    if (queryResult.length === 0)
      throw new Error("Invalid Username and Password. Please Try Again");
  } catch (err) {
    res.clearCookie("APIKey");
    res
      .status(STATUS.BAD_REQUEST)
      .send("Invalid Username and Password. Please Try Again");
    return;
  }

  const userID = queryResult[0].VID;

  let APIKey;
  try {
    APIKey = generateKey(userID);
  } catch (err) {
    res.status(STATUS.BAD_REQUEST).send(err.message);
    return;
  }

  res.cookie("APIKey", APIKey, {
    expires: new Date(Date.now() + 900000),
  });
  try {
    const cart = await getCart(userID);
    logger.debug(JSON.stringify(cart));
  } catch {
    res.status(STATUS.BAD_REQUEST).send("Could not get cart");
    return;
  }

  res.status(STATUS.OK).json({ APIKey: APIKey });

  logger.debug("Successfully found user and created API Key");
};

const createVisitor = async () => {
  const vid = uuidv4();
  logger.debug(`Creating visitor: ${vid}`);
  await query("INSERT INTO trinityfashion.Visitor (VID) VALUES (?);", [vid]);
  return vid;
};

const createMember = async (req, res) => {
  // #swagger.tags = ['Users']

  logger.debug(JSON.stringify(req.body));
  const {
    Name,
    Email,
    Address,
    State,
    ZIP,
    Phone,
    CreditCardNo,
    CreditCardCVV,
    CreditCardExpiry,
    username,
    password,
  } = req.body;
  logger.debug(
    JSON.stringify({
      email: Email,
      validateSMTP: false,
    })
  );

  const validation = await emailValidator.validate({
    email: Email,
    validateSMTP: false,
  });

  if (!validation.valid) {
    const message = {
      message: "Invalid Email",
      category: validation.reason,
      reason: validation.validators[validation.reason].reason,
    };
    res.status(STATUS.BAD_REQUEST).json(message);
    return;
  }

  try {
    console.log("In try");
    const vid = await createVisitor();
    logger.debug(`Creating member for visitor: ${vid}`);

    await query(
      "INSERT into trinityfashion.Member (VID, Name, email, Address, State, ZIP, Phone, CreditCardNo, CreditCardCVV," +
        "CreditCardExpiry, username, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
      [
        vid,
        Name,
        Email,
        Address,
        State,
        ZIP,
        Phone,
        CreditCardNo,
        CreditCardCVV,
        CreditCardExpiry,
        username,
        password,
      ]
    );
    const APIKey = generateKey(vid);
    res.cookie("APIKey", APIKey, {
      expires: new Date(Date.now() + 900000),
    });
    res.clearCookie("vid");
    res.status(STATUS.OK).send("Successfully created member");
  } catch {
    res.status(STATUS.BAD_REQUEST).send("Could not create member");
    return;
  }
};

const createSupplier = async (req, res) => {
  // #swagger.tags = ['Users']
  const { Name, username, password, Title } = req.body;

  try {
    const vid = await createVisitor();
    logger.debug(`Creating Supplier for visitor: ${vid}`);

    await query(
      "INSERT into trinityfashion.Supplier (VID, Name, username, password, Title)" +
        " VALUES (?, ?, ?, ?, ?);",
      [vid, Name, username, password, Title]
    );
    const APIKey = generateKey(vid);
    res.cookie("APIKey", APIKey, {
      expires: new Date(Date.now() + 900000),
    });
    res.clearCookie("vid");
    res.status(STATUS.OK).send("Successfully created supplier");
  } catch {
    res.status(STATUS.BAD_REQUEST).send("Could not create supplier");
    return;
  }
};

const generateKey = (vid) => {
  const APIKey = uuidv4();
  const APIKeyDate = new Date(Date.now() + 900000);

  logger.debug(
    `Generated APIKey: ${APIKey} for user ${vid} expiring at ${APIKeyDate.toLocaleString()}`
  );

  query(
    "UPDATE trinityfashion.Member SET APIKey = ?, APIKeyDate = ? WHERE vid = ?;",
    [APIKey, APIKeyDate, vid]
  );
  return APIKey;
};

module.exports = {
  checkLogIn,
  createMember,
  createSupplier,
};
