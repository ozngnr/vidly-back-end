const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: String,
  description: {
    type: String,
    default: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
      Accusamus ipsam saepe magni quos nulla dolore omnis voluptatibus 
      inventore nisi quia, rerum, similique laboriosam ut totam 
      obcaecati nesciunt ipsum. Ipsa, aspernatur!`,
  },
  genre: Object,
  numberInStock: Number,
  dailyRentalRate: Number,
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = {
  Movie,
};
