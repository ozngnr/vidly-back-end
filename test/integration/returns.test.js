const mongoose = require('mongoose');
const request = require('supertest');
const moment = require('moment');
const { Rental } = require('../../models/rental');
const { User } = require('../../models/user');
const { Movie } = require('../../models/movie');

describe('/api/returns', () => {
  let server;
  let customerId;
  let movieId;
  let rental;
  let movie;
  let token;

  const exec = async () => {
    return request(server)
      .post('/api/returns')
      .set('x-auth-token', token)
      .send({ customerId, movieId });
  };

  beforeEach(async () => {
    server = require('../../server');

    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    token = new User().generateAuthToken();

    movie = new Movie({
      _id: movieId,
      title: '12345',
      genre: {
        name: '12345',
      },
      dailyRentalRate: 2,
      numberInStock: 10,
    });

    rental = new Rental({
      customer: {
        _id: customerId,
        name: '12345',
        phone: '12345',
      },
      movie: {
        _id: movieId,
        title: '12345',
        dailyRentalRate: 2,
      },
    });

    await movie.save();
    await rental.save();
  });

  afterEach(async () => {
    await Rental.remove({});
    await Movie.remove({});
    await server.close();
  });

  it('Should return 401 if client is not logged in', async () => {
    token = '';

    const res = await exec();

    expect(res.status).toBe(401);
  });

  it('Should return 400 if customerId is not provided', async () => {
    customerId = '';

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('Should return 400 if movieId is not provided', async () => {
    movieId = '';

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('Should return 404 if no rental found for this customer/movie', async () => {
    await Rental.deleteMany({});

    const res = await exec();

    expect(res.status).toBe(404);
  });

  it('Should return 400 if return already processed', async () => {
    rental.dateReturned = new Date();
    await rental.save();

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('Should return 200 if return is valid', async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });

  it('Should set the return date if input is valid', async () => {
    const res = await exec();

    const rentalInDb = await Rental.findById(rental._id);
    const diff = new Date() - rentalInDb.dateReturned;

    expect(rentalInDb.dateReturned).toBeDefined();
    expect(diff).toBeLessThan(10 * 1000);
    expect(res.status).toBe(200);
  });

  it('Should set the rental fee if input is valid', async () => {
    //set dateOut to 7 days ago
    rental.dateOut = moment().add(-7, 'days').toDate();
    await rental.save();

    const res = await exec();

    const rentalInDb = await Rental.findById(rental._id);

    expect(rentalInDb.rentalFee).toBeDefined();
    expect(rentalInDb.rentalFee).toBe(14);
    expect(res.status).toBe(200);
  });

  it('Should increase the movie stock by 1', async () => {
    const res = await exec();

    const movieInDb = await Movie.findById({ _id: movieId });

    expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
    expect(res.status).toBe(200);
  });

  it('Should return the rental object', async () => {
    const res = await exec();

    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining([
        'dateOut',
        'dateReturned',
        'rentalFee',
        'movie',
        'customer',
      ])
    );
  });
});
