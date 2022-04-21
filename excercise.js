const mongoose = require('mongoose');

mongoose
  .connect('mongodb://localhost/vidly')
  .then(() => console.log('Connected to vidly database'))
  .catch((err) => console.log(err));

const courseSchema = new mongoose.Schema({
  tags: [String],
  date: Date || new Date(),
  name: String,
  author: String,
  isPublished: Boolean,
  price: Number,
});
const Course = mongoose.model('Course', courseSchema);

const getCourses = async () => {
  return await Course.find()
    .and([{ name: /.*by.*/i }, { price: { $gt: 15 } }])
    .sort({ price: 'desc' });
};

const run = async () => {
  const courses = await getCourses();
  console.log(courses);
};

run();
