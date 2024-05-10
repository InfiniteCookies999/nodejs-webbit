const supertest = require("supertest");
const createApp = require('../../src/create.app');

const app = createApp();

const statusOkMock = (req, res, next) => {
    res.status(200).json({});
}

jest.mock('../../src/controllers/post.controller', () => {
  return {
    create: statusOkMock,
    delete: statusOkMock
  }
});
jest.mock('../../src/middleware/validation', () => {
  return {
    ...jest.requireActual('../../src/middleware/validation'),
    validateLogin: jest.fn((req, res, next) => next())
  }
});

describe('route POST /subwebbit/:name/post', () => {
  it('title too long', async () => {
    const body = {
      title: 'a'.repeat(301),
      body: 'contents of the post'
    };

    await supertest(app)
      .post('/subwebbit/subname/post')
      .send(body)
      .set('Content-Type', 'application/json')
      .expect(400)
      .then(res => {
        expect(res.body.errors.length).toBe(1);
        expect(res.body.errors[0].path).toBe('title');
      });
  });
  it('post created successfully', async () => {
    const body = {
      title: 'post title',
      body: 'contents of the post'
    };

    await supertest(app)
      .post('/subwebbit/subname/post')
      .send(body)
      .set('Content-Type', 'application/json')
      .expect(200);
  });
});

describe('route DELETE /subwebbit/:name/post/:id', () => {
  it('id not an integer', async () => {
    await supertest(app)
      .delete('/subwebbit/subname/post/abc')
      .expect(400)
      .then(res => {
        expect(res.body.errors.length).toBe(1);
        expect(res.body.errors[0].path).toBe('id');
      });
  });
  it('delete successful', async () => {
    await supertest(app)
      .delete('/subwebbit/subname/post/1')
      .expect(200);
  });
});