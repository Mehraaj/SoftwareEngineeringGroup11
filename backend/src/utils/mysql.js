const mysql = require("mysql2");
const logger = require("./logger");

const { DB_HOST, DB_USER, DB_PASSWORD } = process.env;

logger.info(
  `Connecting to MySQL database at ${DB_HOST} with ${DB_USER}|${DB_PASSWORD}...`
);

const db = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
});

db.connect(function (err) {
  if (err) throw err;
  logger.info("Connected to MySQL database!");
});

const query = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) {
        logger.error(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = query;
