const express = require('express');
const router = express.Router();

const { createReturn } = require('../controllers/returnControllers');
const auth = require('../middleware/auth');

//end point api/returns

router.post('/', auth, createReturn);

module.exports = router;
