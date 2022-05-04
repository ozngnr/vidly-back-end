const logger = require('../utils/logger');
const mongoose = require('mongoose');

module.exports = () => {
  mongoose
    .connect('mongodb://localhost/vidly')
    .then(() => logger.info('Connected to Vidly database'));
};
