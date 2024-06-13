const supertest = require("supertest");
const createApp = require('../../src/create.app');

const app = createApp();


jest.mock('../../src/middleware/validation', () => {
  return {
    ...jest.requireActual('../../src/middleware/validation'),
    validateLogin: jest.fn((req, res, next) => next())
  }
});

describe('route PUT /user/gender', () => {
  it('invalid gender not in list', async () => {
    const body = {
      gender: 'Bad'
    };

    await supertest(app)
      .put('/api/user/gender')
      .send(body)
      .set('Content-Type', 'application/json')
      .expect(400)
      .then(res => {
        expect(res.body.errors.length).toBe(1);
        expect(res.body.errors[0].path).toBe('gender');
      });
  });
});
