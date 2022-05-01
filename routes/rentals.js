const express = require('express');
const router = express.Router();
const rentalControllers = require('../controllers/rentalControllers');

//end point api/rentals

router.get('/', rentalControllers.getRentals);
router.get('/:_id', rentalControllers.getRental);
router.post('/', rentalControllers.createRental);

module.exports = router;
