const mongoose = require('mongoose');
const request = require('supertest');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');

let server;

describe('/api/genres', () => {
  beforeEach(() => {
    server = require('../../server');
  });

  afterEach(async () => {
    await Genre.deleteMany({});
    await server.close();
  });

  describe('GET /', () => {
    it('should return all genres', async () => {
      await Genre.collection.insertMany([
        { name: 'genre1' },
        { name: 'genre2' },
      ]);
      const res = await request(server).get('/api/genres');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });
  });

  describe('GET /:id', () => {
    it('should return a genre with given ID', async () => {
      const genre = await Genre.create({ name: 'genre1' });
      const res = await request(server).get(`/api/genres/${genre._id}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', genre.name);
    });

    it('should return 404 if invalid ID is passed', async () => {
      const res = await request(server).get(`/api/genres/1`);

      expect(res.status).toBe(404);
    });

    it("should return 404 if genre doesn't exists", async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get(`/api/genres/${id}`);

      expect(res.status).toBe(404);
    });
  });

  describe('POST /', () => {
    let token;
    let name;

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = 'genre1';
    });

    const exec = async () => {
      return await request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({ name });
    };

    it('should return 401 if client is not logged in', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 400 if genre already exists', async () => {
      await Genre.create({ name: 'genre1' });

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if genre is less than 3 characters', async () => {
      name = '12';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if genre is more than 50 characters', async () => {
      name = new Array(52).join('a');

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should save the genre if it is valid', async () => {
      await exec();

      const genre = await Genre.find({ name: 'genre1' });

      expect(genre).not.toBeNull();
    });

    it('should return the genre if it is valid', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', 'genre1');
    });
  });

  describe('PUT /:id', () => {
    let token;
    let newName;
    let genre;
    let id;

    beforeEach(async () => {
      genre = await Genre.create({ name: 'genre1' });
      token = new User().generateAuthToken();
      id = genre._id;
      newName = 'updatedName';
    });

    const exec = async () => {
      return await request(server)
        .put(`/api/genres/${id}`)
        .set('x-auth-token', token)
        .send({ name: newName });
    };

    it('should return the updated genre with given ID', async () => {
      newName = 'genre2';

      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', 'genre2');
    });

    it('should return 400 if updated genre is less than 3 characters', async () => {
      newName = '12';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if updated genre is more than 50 characters', async () => {
      newName = new Array(52).join('a');

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 404 if genre was not found', async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /:id', () => {
    let token;
    let genre;
    let id;

    const exec = async () => {
      return await request(server)
        .delete('/api/genres/' + id)
        .set('x-auth-token', token)
        .send();
    };

    beforeEach(async () => {
      // Before each test we need to create a genre and
      // put it in the database.
      genre = new Genre({ name: 'genre1' });
      await genre.save();

      id = genre._id;
      token = new User({ isAdmin: true }).generateAuthToken();
    });

    it('should return 401 if client is not logged in', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 403 if the user is not an admin', async () => {
      token = new User({ isAdmin: false }).generateAuthToken();

      const res = await exec();

      expect(res.status).toBe(403);
    });

    it('should return 404 if no genre with the given id was found', async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should delete the genre if input is valid', async () => {
      await exec();

      const genreInDb = await Genre.findById(id);

      expect(genreInDb).toBeNull();
    });

    it('should return the removed genre', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('_id', genre._id.toHexString());
      expect(res.body).toHaveProperty('name', genre.name);
    });
  });
});
