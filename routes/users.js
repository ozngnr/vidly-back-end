const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/userControllers');

//end point api/users

router.post('/', userControllers.createUser);

module.exports = router;
