const { Movie } = require('../models/movie');
const { Genre } = require('../models/genre');
const Joi = require('joi');

const validateMovie = (movie) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number(),
    dailyRentalRate: Joi.number(),
  });

  return schema.validate(movie);
};

const getMovies = async (req, res) => {
  const movies = await Movie.find({}).sort('title');
  res.json(movies);
};

const getMovie = async (req, res) => {
  const movie = await Movie.findById(req.params._id);

  if (!movie)
    return res.status(404).send('Movie with the given ID was not found.');
  res.json(movie);
};

const createMovie = async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre)
    return res.status(404).sent('Genre with the given ID was not found.');

  const movie = await new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });

  await movie.save();
  res.json(movie);
};

const updateMovie = async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre)
    return res.status(404).sent('Genre with the given ID was not found.');

  const updatedGenre = await Movie.findByIdAndUpdate(
    req.params._id,
    {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    },
    { new: 'true' }
  ).select('-__v');

  res.json(updatedGenre);
};

const deleteMovie = async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);

  if (!movie)
    return res.status(404).send('Movie with the given ID was not found.');

  res.send(movie);
};

module.exports = {
  getMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie,
};
