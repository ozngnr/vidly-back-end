const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectID = require('../middleware/validateObjectID');

const {
  getGenre,
  getGenres,
  createGenre,
  updateGenre,
  deleteGenre,
} = require('../controllers/genreControllers');

//end point api/genres

router.get('/', getGenres);
router.get('/:_id', validateObjectID, getGenre);
router.post('/', auth, createGenre);
router.put('/:_id', auth, updateGenre);
router.delete('/:_id', [auth, admin], deleteGenre);

module.exports = router;
