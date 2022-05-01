const mongoose = require('mongoose');
const { genreSchema } = require('./genre');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    minLength: 5,
    maxLength: 255,
    required: true,
  },
  description: {
    type: String,
    default: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
      Accusamus ipsam saepe magni quos nulla dolore omnis voluptatibus 
      inventore nisi quia, rerum, similique laboriosam ut totam 
      obcaecati nesciunt ipsum. Ipsa, aspernatur!`,
    minLength: 5,
    maxLength: 255,
  },
  genre: genreSchema,
  numberInStock: { type: Number, min: 0, max: 255, required: true },
  dailyRentalRate: { type: Number, min: 0, max: 10, required: true },
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = {
  Movie,
};
