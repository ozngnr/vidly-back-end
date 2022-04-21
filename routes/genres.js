const express = require('express');
const router = express.Router();
const genreControllers = require('../controllers/genreControllers');

//end point api/genres

router.get('/', genreControllers.getGenres);
router.post('/', genreControllers.createGenre);
router.put('/:_id', genreControllers.updateGenre);
router.delete('/:_id', genreControllers.deleteGenre);

module.exports = router;
