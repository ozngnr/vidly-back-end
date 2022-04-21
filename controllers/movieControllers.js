const { Movie } = require('../models/movie');
const Joi = require('joi');

const validateMovie = (movie) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    genre: Joi.object(),
    numberInStock: Joi.number(),
    dailyRentalRate: Joi.number(),
  });

  return schema.validate(movie);
};

const getMovies = async (req, res) => {
  const movies = await Movie.find({});
  res.json(movies);
};

const createMovie = async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(404).send(error.message);

  const movie = await Movie.create(req.body);
  res.json(movie);
};

module.exports = {
  getMovies,
  createMovie,
};
