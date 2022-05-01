const { Rental } = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');
const Joi = require('joi');

function validateRental(rental) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });

  return schema.validate(rental);
}

const getRentals = async (req, res) => {
  const rentals = await Rental.find({}).sort('-dateout');
  res.json(rentals);
};

const getRental = async (req, res) => {
  const rental = await Rental.findById(req.params._id);

  if (!rental)
    return res.status(404).send('Rental with the given ID was not found.');
  res.json(rental);
};

const createRental = async (req, res) => {
  const { error } = validateRental(req.body);
  if (error) return res.status(400).send(error.message);

  const movie = await Movie.findById(req.body.movieId);
  if (!movie)
    return res.status(404).send('Movie with the given ID was not found.');

  if (movie.numberInStock === 0)
    return res.status(400).send('Movie not in stock.');

  const customer = await Customer.findById(req.body.customerId);
  if (!customer)
    return res.status(404).sent('Customer with the given ID was not found.');

  const rental = await new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  rental.save();
  movie.numberInStock--;
  movie.save();
  res.json(rental);
};

module.exports = {
  getRentals,
  getRental,
  createRental,
};
