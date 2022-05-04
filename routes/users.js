const express = require('express');
const router = express.Router();
const { getUser, createUser } = require('../controllers/userControllers');
const auth = require('../middleware/auth');

//end point api/users
router.get('/me', auth, getUser);
router.post('/', createUser);

module.exports = router;
