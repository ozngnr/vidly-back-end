const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  isGold: { type: Boolean, default: false },
  name: String,
  phone: String,
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = {
  Customer,
};
