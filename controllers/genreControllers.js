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

  try {
    const genre = await Genre.exists({ name: req.body.name });
    if (genre) return res.status(409).send('Genre already exists');

    const newGenre = await Genre.create(req.body);
    res.json(newGenre);
  } catch (err) {
    console.log(err);
    return res.status(400).send('Something went wrong.');
  }
};

const updateGenre = async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.message);

  try {
    const genre = await Genre.findByIdAndUpdate(
      req.params._id,
      { name: req.body.name },
      { new: 'true' }
    ).select('-__v');

    if (!genre)
      return res.status(404).send('Genre with the given ID was not found.');

    res.json(genre);
  } catch (err) {
    console.log(err);
    res.status(400).send('Something went wrong.');
  }
};

const deleteGenre = async (req, res) => {
  try {
    const genre = await Genre.findByIdAndDelete(req.params._id).select('-__v');

    if (!genre)
      return res.status(404).send('Genre with the given ID was not found.');
    res.json(genre);
  } catch (err) {
    console.log(err);
    res.status(400).send('Something went wrong.');
  }
};

module.exports = {
  getGenres,
  createGenre,
  updateGenre,
  deleteGenre,
};
