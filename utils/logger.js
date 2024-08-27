const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, errors } = format;
const moment = require("moment-timezone");
require("winston-daily-rotate-file");
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

const fileRotateTransport = new transports.DailyRotateFile({
  filename: "logs/rotate-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxFiles: "14d",
});

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({
      format: () => moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"),
    }),
    format.printf(({ timestamp, level, message, ...meta }) => {
      let log = `${timestamp} [${level}] : ${message} `;
      if (Object.keys(meta).length) {
        log += JSON.stringify(meta, null, 2); // Pretty-print JSON
      }
      return log;
    })
  ),
  transports: [new transports.Console(), fileRotateTransport],
});

module.exports = logger;
