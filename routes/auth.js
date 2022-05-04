const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { User } = require('../models/user');
const bcrypt = require('bcrypt');

const validate = (req) => {
  const schema = Joi.object({
    email: Joi.string().email().min(5).max(255).trim().required(),
    password: Joi.string().min(8).max(255).trim().required(),
  });

  return schema.validate(req);
};

// api/auth
router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.message);

  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid email or password.');

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(400).send('Invalid email or password.');

    const token = user.generateAuthToken();
    res.json(token);
  } catch (error) {
    console.log(error);
    res.status(500).send('Something went wrong.');
  }
});

module.exports = router;
