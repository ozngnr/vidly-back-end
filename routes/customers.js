const express = require('express');
const router = express.Router();
const customerControllers = require('../controllers/customerControllers');

//end point api/customers

router.get('/', customerControllers.getCustomers);
router.post('/', customerControllers.createCustomer);
router.put('/:_id', customerControllers.updateCustomer);
router.delete('/:_id', customerControllers.deleteCustomer);

module.exports = router;
