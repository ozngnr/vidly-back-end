const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

mongoose
  .connect('mongodb://localhost/vidly')
  .then(() => console.log('Connected to Vidly database'))
  .catch((err) => console.log(err));

// Routes
const genres = require('./routes/genres');
const movies = require('./routes/movies');
const customers = require('./routes/customers');
const rentals = require('./routes/rentals');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/genres', genres);
app.use('/api/movies', movies);
app.use('/api/customers', customers);
app.use('/api/rentals', rentals);

app.listen(port, () => console.log(`Listening on port ${port}`));
