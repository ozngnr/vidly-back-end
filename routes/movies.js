const express = require('express');
const router = express.Router();
const movieControllers = require('../controllers/movieControllers');

//end point api/movies

router.get('/', movieControllers.getMovies);
router.post('/', movieControllers.createMovie);
// router.put('/:_id', movieControllers.updateGenre);
// router.delete('/:_id', movieControllers.deleteGenre);

module.exports = router;
