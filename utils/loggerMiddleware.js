const expressWinston = require("express-winston");
const logger = require("./logger");

const requestLogger = expressWinston.logger({
  winstonInstance: logger,
  msg: "{{req.method}} {{req.url}}",
  meta: true,
});

const errorLogger = expressWinston.errorLogger({
  winstonInstance: logger,
});

module.exports = {
  requestLogger,
  errorLogger,
};
