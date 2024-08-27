// app.js
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const socketRoute = require("./route/socketRoute");
const logger = require("./utils/logger");

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.static("public"));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Route imports
app.use("/api/v1/socket", socketRoute);
// Global error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.message, { stack: err.stack });
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
