const supertest = require("supertest");
const createApp = require('../../src/create.app');

const app = createApp();

const statusOkMock = (req, res, next) => {
    res.status(200).json({});
}

jest.mock('../../src/controllers/post.controller', () => {
  const Controller = jest.requireActual('../../src/controllers/post.controller');
  const mocked = {};
  Object.getOwnPropertyNames(Object.getPrototypeOf(Controller))
    .forEach(f => mocked[f] = statusOkMock);
  return mocked;
});

jest.mock('../../src/middleware/validation', () => {
  return {
    ...jest.requireActual('../../src/middleware/validation'),
    validateLogin: jest.fn((req, res, next) => next())
  }
});

describe('route POST /api/post', () => {
  it('title too long', async () => {
    const body = {
      title: 'a'.repeat(301),
      body: 'contents of the post',
      subname: 'subname'
    };

    await supertest(app)
      .post('/api/post')
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
      body: 'contents of the post',
      subname: 'subname'
    };

    await supertest(app)
      .post('/api/post')
      .send(body)
      .set('Content-Type', 'application/json')
      .expect(200);
  });
});

describe('route DELETE /api/post/:id', () => {
  it('id not an integer', async () => {
    await supertest(app)
      .delete('/api/post/abc')
      .expect(400)
      .then(res => {
        expect(res.body.errors.length).toBe(1);
        expect(res.body.errors[0].path).toBe('id');
      });
  });
  it('delete successful', async () => {
    await supertest(app)
      .delete('/api/post/1')
      .expect(200);
  });
});

describe('route GET /api/posts/:pageNumber', () => {
  it('pageNumber not an integer', async () => {
    await supertest(app)
      .get('/api/posts/abc')
      .expect(400)
      .then(res => {
        expect(res.body.errors.length).toBe(1);
        expect(res.body.errors[0].path).toBe('pageNumber');
      });
  });
  it('get success', async () => {
    await supertest(app)
      .get('/api/posts/1')
      .expect(200);
  });
});