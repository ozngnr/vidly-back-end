const config = require('config');

module.exports = () => {
  console.log(config.get('jwtPrivateKey'));

  if (!config.get('jwtPrivateKey')) {
    throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
  }
};
