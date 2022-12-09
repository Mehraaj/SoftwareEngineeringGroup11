const { v4: uuidv4 } = require("uuid");
const logger = require("../utils/logger");
const query = require("../utils/mysql");
const STATUS = require("http-status");

const checkLogIn = async (req, res) => {
  const { username, password } = req.query;

  let queryResult;
  try {
    queryResult = await query(
      "select * from trinityfashion.Supplier where username = ? and password = ?;",
      [username, password]
    );
    if (queryResult.length === 0)
      throw new Error("Invalid Username and Password. Please Try Again");
  } catch (err) {
    res
      .status(STATUS.BAD_REQUEST)
      .send("Invalid Username and Password. Please Try Again");
    return;
  }

  const userID = queryResult[0].VID;

  const APIKey = uuidv4();
  const APIKeyDate = new Date();

  logger.debug(
    `Generated APIKey: ${APIKey} for user ${userID} expiring at ${APIKeyDate.toLocaleString()}`
  );

  try {
    query(
      "UPDATE trinityfashion.Supplier SET APIKey = ?, APIKeyDate = ? WHERE vid = ?;",
      [APIKey, APIKeyDate, userID]
    );
  } catch (err) {
    res.status(STATUS.BAD_REQUEST).send(err.message);
    return;
  }

  res.cookie("APIKey", APIKey, {
    expires: new Date(Date.now() + 900000),
  });

  res
    .status(STATUS.OK)
    .json({ APIKey: APIKey, APIKeyDate: APIKeyDate.toString() });

  logger.debug("Successfully found user and created API Key");
};

const addProduct = async (req, res) => {
  const {
    PID,
    Category,
    Name,
    Price,
    SubCategory,
    gender,
    image,
    Size,
    Color,
  } = req.body;

  const vid = req.cookies.vid;

  try {
    await query(
      "INSERT into trinityfashion.ProductCatalog (PID, Category, Name, Price, SubCategory, gender, image" +
        " VALUES (?, ?, ?, ?, ?, ?, ?);",
      [PID, Category, Name, Price, SubCategory, gender, image]
    );
    if (Category === "shirts") {
      await query(
        "INSERT into trinityfashion.Shirts (PID, Size, color)" +
          " VALUES (?, ?, ?);",
        [PID, Size, Color]
      );
    } else if (Category === "pants") {
      await query(
        "INSERT into trinityfashion.Pants (PID, Size, color)" +
          " VALUES (?, ?, ?);",
        [PID, Size, Color]
      );
    } else if (Category === "shoes") {
      await query(
        "INSERT into trinityfashion.Shoes (PID, Size, color)" +
          " VALUES (?, ?, ?);",
        [PID, Size, Color]
      );
    } else if (Category === "hats") {
      await query(
        "INSERT into trinityfashion.Hats (PID, Size, color)" +
          " VALUES (?, ?, ?);",
        [PID, Size, Color]
      );
    } else if (Category === "socks") {
      await query(
        "INSERT into trinityfashion.Socks (PID, Size, color)" +
          " VALUES (?, ?, ?);",
        [PID, Size, Color]
      );
    }
    res.cookie("APIKey", "None");
    res.cookie("vid", vid);
    res.status(STATUS.OK).send("Successfully added product");
  } catch {
    res.status(STATUS.BAD_REQUEST).send("Could not add product");
    return;
  }
};

module.exports = {
  checkLogIn,
  addProduct,
};
