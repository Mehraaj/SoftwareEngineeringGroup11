const query = require("../utils/mysql");
const logger = require("../utils/logger");
const STATUS = require("http-status");

const verifyUser = (stopPropogation) => {
  return async (req, res, next) => {
    const { APIKey } = req.cookies;

    if (!APIKey || APIKey === "None") {
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
        "SELECT VID, APIKeyDate FROM trinityfashion.Member WHERE APIKey = ?",
        [APIKey]
      );
      if (result.length === 0) {
        throw new Error("Could not verify API key");
      } else if (new Date(result[0].APIKeyDate) < new Date()) {
        throw new Error("API Key expired");
      } else {
        req.user = { vid: result[0].VID };
        logger.info(`User ${result[0].VID} verified`);
      }
    } catch (err) {
      logger.error(err);
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
