const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getRentals,
  getRental,
  createRental,
} = require('../controllers/rentalControllers');

//end point api/rentals
router.get('/', getRentals);
router.get('/:_id', getRental);
router.post('/', auth, createRental);

module.exports = router;
