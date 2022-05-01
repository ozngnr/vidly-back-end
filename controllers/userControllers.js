const Joi = require('joi');
const { User } = require('../models/user');
const bcrypt = require('bcrypt');

const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().email().min(5).max(255).trim().required(),
    password: Joi.string().min(8).max(255).trim().required(),
  });

  return schema.validate(user);
};

const createUser = async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.message);

  try {
    const user = await User.findOne({ email: req.body.email });
    if (user)
      return res
        .status(400)
        .send('The email address is already associated with another account.');

    // Hash user password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(req.body.password, salt);

    const { _id, name, email } = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashed,
    });

    res.json({ _id, name, email });
  } catch (error) {
    console.log(error);
    res.status(500).send('Something went wrong.');
  }
};

module.exports = {
  createUser,
};
