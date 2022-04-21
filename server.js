const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

mongoose
  .connect('mongodb://localhost/vidly')
  .then(() => console.log('Connected to vidly database'))
  .catch((err) => console.log(err));

// Routes
const genres = require('./routes/genres');
const movies = require('./routes/movies');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/genres', genres);
app.use('/api/movies', movies);

app.listen(port, () => console.log(`Listening on port ${port}`));
