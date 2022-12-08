const logger = require('../utils/logger');
const config = require('config');
const mongoose = require('mongoose');

module.exports = () => {
  const db = config.get('db');
  mongoose.connect(db).then(() => logger.info(`Connected to ${db}...`));
};
