const config = require('config');
const logger = require('./utils/logger');
const express = require('express');
const app = express();

require('./startup/cors')(app);
require('./startup/routes')(app);
require('./startup/config')();
require('./startup/db')();
require('./startup/prod')(app);
require('./startup/validation');

const port = config.get('port') || 3000;
const server = app.listen(port, () => logger.info(`Listening on port ${port}`));

module.exports = server;
