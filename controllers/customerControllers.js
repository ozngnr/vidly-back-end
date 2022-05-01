const { Customer } = require('../models/customer');
const Joi = require('joi');

const validateCustomer = (customer) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    phone: Joi.string()
      .regex(/[0-9]{11}/)
      .message('Phone must be 11 digits long')
      .required(),
    isGold: Joi.boolean(),
  });

  return schema.validate(customer);
};

const getCustomers = async (req, res) => {
  try {
    const allCustomers = await Customer.find({}).select('-__v');
    res.json(allCustomers);
  } catch (error) {
    res.status(400).send('Something went wrong.');
  }
};

const createCustomer = async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.message);

  try {
    const customer = await Customer.exists({ name: req.body.name });
    if (customer) return res.status(409).send('Customer already exists');

    const newCustomer = await Customer.create(req.body);
    res.json(newCustomer);
  } catch (err) {
    console.log(err);
    return res.status(400).send('Something went wrong.');
  }
};

const updateCustomer = async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.message);

  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params._id,
      { name: req.body.name, phone: req.body.phone, isGold: req.body.isGold },
      { new: 'true' }
    ).select('-__v');

    if (!customer)
      return res.status(404).send('Customer with the given ID was not found.');

    res.json(customer);
  } catch (err) {
    console.log(err);
    res.status(400).send('Something went wrong.');
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params._id).select(
      '-__v'
    );

    if (!customer)
      return res.status(404).send('Customer with the given ID was not found.');
    res.json(customer);
  } catch (err) {
    console.log(err);
    res.status(400).send('Something went wrong.');
  }
};

module.exports = {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};