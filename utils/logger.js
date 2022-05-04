const { createLogger, format, transports } = require('winston');
require('express-async-errors');

module.exports = createLogger({
  transports: [
    new transports.File({
      filename: 'logfile.log',
      level: 'warn',
      format: format.combine(
        format.timestamp({ format: 'MM-DD-YYYY HH:mm:ss' }),
        format.align(),
        format.printf(
          (info) => `${info.level}: ${[info.timestamp]}: ${info.stack}`
        )
      ),
      handleExceptions: true,
      handleRejections: true,
    }),
    new transports.Console({
      format: format.combine(
        format.printf((info) => `${info.stack || info.message}`)
      ),
      handleExceptions: true,
      handleRejections: true,
    }),
  ],
});
