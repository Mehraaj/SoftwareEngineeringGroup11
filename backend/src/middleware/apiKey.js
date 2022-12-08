const query = require("../utils/mysql");
const logger = require("../utils/logger");
const STATUS = require("http-status");

const verifyUser = (stopPropogation) => {
  return async (req, res, next) => {
    const { APIKey } = req.cookies;

    if (!APIKey) {
      logger.error("No API Key provided");
      if (stopPropogation) {
        return res.status(STATUS.UNAUTHORIZED).send("No API Key provided");
      } else {
        res.locals["authenticated"] = false;
        next(false);
        return;
      }
    }

    logger.info(`APIKey: ${APIKey}`);

    try {
      const result = await query(
        "SELECT * FROM trinityfashion.Member WHERE APIKey = ?",
        [APIKey]
      );
      if (result.length > 0) {
        req.user = { vid: result[0].VID };
        logger.info(`User ${result[0].VID} verified`);
      } else {
        throw new Error();
      }
    } catch (err) {
      logger.error("Could not verify API key");
      if (stopPropogation) {
        return res.status(STATUS.UNAUTHORIZED).send("Could not verify API key");
      } else {
        res.locals["authenticated"] = false;
        next(false);
        return;
      }
    }
    res.locals["authenticated"] = true;
    next();
  };
};

module.exports = {
  verifyUser,
};
