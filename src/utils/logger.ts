import { createLogger, transports, format } from 'winston';
import path from 'path';

const { combine, timestamp, printf, colorize, errors } = format;

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const logger = createLogger({
  level: 'info', // default log level
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }), // capture stack trace if available
    logFormat
  ),
  transports: [
    new transports.Console({
      format: combine(colorize(), logFormat)
    }),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/warn.log', level: 'warn' }),
    new transports.File({ filename: 'logs/combined.log' })
  ]
});

export default logger;
