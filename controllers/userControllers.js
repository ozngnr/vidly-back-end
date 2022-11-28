const Joi = require('joi');
const { User } = require('../models/user');
const bcrypt = require('bcrypt');

const validateUser = (user) => {
  const schema = Joi.object({
    email: Joi.string().email().min(5).max(255).trim().required(),
    password: Joi.string().min(8).max(255).trim().required(),
    name: Joi.string().min(5).max(50).required(),
  });

  return schema.validate(user);
};

const getUser = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json(user);
};

const createUser = async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered.');

  // Hash user password
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(req.body.password, salt);

  user = await new User({
    name: req.body.name,
    email: req.body.email,
    password: hashed,
  });

  const token = user.generateAuthToken();
  await user.save();
  res
    .header('x-auth-token', token)
    .header('access-control-expose-headers', 'x-auth-token')
    .json({ _id: user._id, name: user.name, email: user.email });
};

module.exports = {
  getUser,
  createUser,
};
