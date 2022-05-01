const express = require('express');
const router = express.Router();
const movieControllers = require('../controllers/movieControllers');

//end point api/movies

router.get('/', movieControllers.getMovies);
router.get('/:_id', movieControllers.getMovie);
router.post('/', movieControllers.createMovie);
router.put('/:_id', movieControllers.updateMovie);
router.delete('/:_id', movieControllers.deleteMovie);

module.exports = router;
