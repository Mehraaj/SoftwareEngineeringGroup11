const logger = require("../utils/logger");
const query = require("../utils/mysql");

const fetchCatalog = async (req, res) => {
  // #swagger.tags = ['Products']
  const { authenticated } = res.locals;

  let sqlStatement = "SELECT * FROM trinityfashion.productcatalog ";

  if (
    req.query.gender ||
    req.query.name ||
    req.query.category ||
    !authenticated
  ) {
    sqlStatement = sqlStatement + " WHERE ";
  }
  if (!authenticated) {
    sqlStatement =
      sqlStatement + " (Category = 'shirts' or Category = 'pants') ";
  }
  if (req.query.gender && !authenticated) {
    sqlStatement = sqlStatement + " AND ";
  }
  if (req.query.gender) {
    sqlStatement = sqlStatement + " gender = '" + req.query.gender + "' ";
  }
  if (req.query.category && (!authenticated || req.query.gender)) {
    sqlStatement = sqlStatement + " AND ";
  }
  if (req.query.category) {
    sqlStatement = sqlStatement + " Category = '" + req.query.category + "' ";
  }
  if (
    req.query.name &&
    (!authenticated || req.query.gender || req.query.category)
  ) {
    sqlStatement = sqlStatement + " AND ";
  }
  if (req.query.name) {
    sqlStatement = sqlStatement + " Name = '" + req.query.name + "' ";
  }
  if (req.query.price) {
    sqlStatement = sqlStatement + "ORDER BY Price " + req.query.price;
  }

  try {
    const result = await query(sqlStatement);
    res.status(200).json({ data: result });
    return;
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const fetchCatalogById = async (req, res) => {
  // #swagger.tags = ['Products']
  const { id } = req.params;

  try {
    const valid = await verifyID(id);
    if (!valid) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    const data = await query(
      "SELECT * FROM trinityfashion.productcatalog WHERE pid = ?",
      [id]
    );
    const sizes = await fetchSizes(data[0].Category, id);
    const colors = await fetchColors(data[0].Category, id);

    res.status(200).json({ data, sizes, colors });
    return;
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const verifyID = async (id) => {
  const sql = "SELECT * FROM trinityfashion.productcatalog WHERE pid = ?";
  const result = await query(sql, [id]);
  return result.length > 0;
};

const fetchSizes = async (category, pid) => {
  const sql = `SELECT DISTINCT size FROM trinityfashion.${category} WHERE pid = ?`;
  const result = await query(sql, [pid]);
  return result.map((row) => row.size);
};

const fetchColors = async (category, pid) => {
  const sql = `SELECT DISTINCT color,image FROM trinityfashion.${category} WHERE pid = ?`;
  const result = await query(sql, [pid]);
  return result;
};

module.exports = {
  fetchCatalog,
  fetchCatalogById,
};
