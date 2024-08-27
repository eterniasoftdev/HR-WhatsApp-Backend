// responseHelper.js
const logger = require("./logger");

const sendResponse = (res, statusCode, message, data = null) => {
  const response = {
    status: statusCode,
    message,
    data,
  };

  // Log the response with appropriate log level
  if (statusCode >= 500) {
    logger.error(`${statusCode} - ${message}`, { data });
  } else if (statusCode >= 400) {
    logger.warn(`${statusCode} - ${message}`, { data });
  } else {
    logger.info(`${statusCode} - ${message}`, { data });
  }

  res.status(statusCode).send(data);
};

module.exports = sendResponse;
