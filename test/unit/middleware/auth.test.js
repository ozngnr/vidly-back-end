const { User } = require('../../../models/user');
const auth = require('../../../middleware/auth');
const { default: mongoose } = require('mongoose');

describe('auth middleware', () => {
  it('should req.user with the payload of a valid JWT', () => {
    const user = {
      _id: mongoose.Types.ObjectId(),
      isAdmin: true,
    };
    const token = new User(user).generateAuthToken();
    const req = {
      header: jest.fn().mockReturnValue(token),
    };
    const next = jest.fn();
    const res = {};

    auth(req, res, next);
    expect(req.user).toMatchObject(user);
  });
});
