const config = require('config');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    minlength: 5,
    maxlength: 50,
    required: true,
  },
  email: {
    type: String,
    minlength: 5,
    maxlength: 255,
    unique: true,
    required: true,
  },
  password: { type: String, minlength: 5, maxlength: 255, required: true },
  isAdmin: Boolean,
  likedMovies: [String],
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      isAdmin: this.isAdmin,
      name: this.name,
      email: this.email,
      likedMovies: this.likedMovies
    },
    config.get('jwtPrivateKey')
  );
  return token;
};
const User = mongoose.model('User', userSchema);

module.exports = {
  User,
};
