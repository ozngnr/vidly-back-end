const express = require('express');
const router = express.Router();
const { getUser, createUser, updateUser } = require('../controllers/userControllers');
const auth = require('../middleware/auth');

//end point api/users
router.get('/me', auth, getUser);
router.post('/', createUser);
router.put('/:_id', auth, updateUser);

module.exports = router;
