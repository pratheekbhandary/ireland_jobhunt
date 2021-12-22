import { createLogger, format, transports } from "winston";

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.errors({ stack: true }),
    format.json(),
    format.splat()
  ),
  defaultMeta: { service: "gnib-appointment" },
  transports: [
    new transports.File({ filename: "gnib-error.log", level: "error" }),
    new transports.File({ filename: "gnib-silly.log", level: "silly" }),
  ],
});

export default logger;

export const successLogger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.errors({ stack: true }),
    format.json(),
    format.splat()
  ),
  defaultMeta: { service: "gnib-appointment" },
  transports: [
    new transports.File({ filename: "gnib-success.log", level: "silly" }),
  ],
});
