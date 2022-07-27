const logger = require('../utils/logger');
const mongoose = require('mongoose');

module.exports = () => {
  const env = process.env.NODE_ENV.toUpperCase();
  const dbUri = process.env[`DB_${env}`];

  mongoose.connect(dbUri).then(() => logger.info(`Connected to ${dbUri}...`));
};
