const { Genre } = require('../models/genre');
const Joi = require('joi');

const validateGenre = (genre) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
  });

  return schema.validate(genre);
};

const getGenres = async (req, res) => {
  const allGenres = await Genre.find({}).select('-__v').sort('name');
  res.json(allGenres);
};

const createGenre = async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.message);

  const genreInDb = await Genre.findOne({ name: req.body.name });
  if (genreInDb) return res.status(409).send('Genre already exists');

  const newGenre = await Genre.create(req.body).select('-__v');
  res.json(newGenre);
};

const updateGenre = async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.message);

  const updatedGenre = await Genre.findByIdAndUpdate(
    req.params._id,
    { name: req.body.name },
    { new: 'true' }
  ).select('-__v');

  res.json(updatedGenre);
};

const deleteGenre = async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params._id);

  if (!genre)
    return res.status(404).send('Genre with the given ID was not found.');
  res.json(genre);
};

module.exports = {
  getGenres,
  createGenre,
  updateGenre,
  deleteGenre,
};
