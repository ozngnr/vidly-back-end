const express = require('express');
const router = express.Router();

const {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require('../controllers/customerControllers');

//end point api/customers

router.get('/', getCustomers);
router.post('/', createCustomer);
router.put('/:_id', updateCustomer);
router.delete('/:_id', deleteCustomer);

module.exports = router;
