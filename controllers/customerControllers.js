const { Customer } = require('../models/customer');
const Joi = require('joi');

const validateCustomer = (customer) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    phone: Joi.string()
      .min(11)
      .max(20)
      .message('Phone must be 11 digits long')
      .required(),
    email: Joi.string().email().required(),
    isGold: Joi.boolean(),
  });

  return schema.validate(customer);
};

const getCustomers = async (req, res) => {
  const allCustomers = await Customer.find({}).select('-__v');
  res.json(allCustomers);
};

const createCustomer = async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.message);

  const customer = await Customer.exists({ email: req.body.email });
  if (customer) return res.status(409).send('Customer already exists');

  const newCustomer = await Customer.create(req.body);
  res.json(newCustomer);
};

const updateCustomer = async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.message);

  const customer = await Customer.findByIdAndUpdate(
    req.params._id,
    { name: req.body.name, phone: req.body.phone, isGold: req.body.isGold },
    { new: 'true' }
  ).select('-__v');

  if (!customer)
    return res.status(404).send('Customer with the given ID was not found.');

  res.json(customer);
};

const deleteCustomer = async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params._id).select(
    '-__v'
  );

  if (!customer)
    return res.status(404).send('Customer with the given ID was not found.');
  res.json(customer);
};

module.exports = {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
