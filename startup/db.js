const logger = require('../utils/logger');
const config = require('config');
const mongoose = require('mongoose');

module.exports = async () => {
  const db = config.get('db');
  await mongoose.connect(db).then(() => logger.info(`Connected to ${db}...`));
};
