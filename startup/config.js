module.exports = () => {
  if (!process.env.VIDLY_JWT_KEY) {
    throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
  }
};
