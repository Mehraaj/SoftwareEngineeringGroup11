require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const routes = require("./routes");
const logger = require("./utils/logger");

const app = express();

const port = process.env.APP_PORT || 8000;

app.use(morgan("tiny"));

app.use(bodyParser.json());
app.use(cookieParser());
//http://localhost:3000'
app.use(cors({
  origin: 'http://localhost:3000',
  credentials : true
}));

app.use("/", routes);

app.listen(port, () =>
  logger.info(`server started on port ${port} (${process.env.NODE_ENV})`)
);

module.exports = app;
