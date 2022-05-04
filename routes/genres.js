const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {
  getGenres,
  createGenre,
  updateGenre,
  deleteGenre,
} = require('../controllers/genreControllers');

//end point api/genres

router.get('/', getGenres);
router.post('/', auth, createGenre);
router.put('/:_id', auth, updateGenre);
router.delete('/:_id', [auth, admin], deleteGenre);

module.exports = router;
