const { Rental } = require('../models/rental');
const { Movie } = require('../models/movie');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const validateReturn = (req) => {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });

  return schema.validate(req);
};

const createReturn = async (req, res) => {
  const { error } = validateReturn(req.body);
  if (error) return res.status(400).send(error.message);

  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  if (!rental) return res.status(404).send('Rental not found.');

  if (rental.dateReturned)
    return res.status(400).send('Rental already returned.');

  rental.return();
  await rental.save();

  //Increase stock
  const movie = await Movie.findById(rental.movie._id);
  movie.numberInStock++;
  await movie.save();

  return res.send(rental);
};

module.exports = {
  createReturn,
};
