const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie,
} = require('../controllers/movieControllers');

//end point api/movies

router.get('/', getMovies);
router.get('/:_id', getMovie);
router.post('/', auth, createMovie);
router.put('/:_id', auth, updateMovie);
router.delete('/:_id', auth, deleteMovie);

module.exports = router;
