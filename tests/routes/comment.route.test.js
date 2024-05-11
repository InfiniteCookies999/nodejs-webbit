const supertest = require("supertest");
const createApp = require('../../src/create.app');

const app = createApp();

const statusOkMock = (req, res, next) => {
    res.status(200).json({});
}

jest.mock('../../src/controllers/comment.controller', () => {
  return {
    create: statusOkMock,
    delete: statusOkMock,
    like: statusOkMock,
    dislike: statusOkMock
  }
});
jest.mock('../../src/middleware/validation', () => {
  return {
    ...jest.requireActual('../../src/middleware/validation'),
    validateLogin: jest.fn((req, res, next) => next())
  }
});

describe('route POST /comment', () => {
  it('postId is not an integer', async () => {

    const body = {
      postId: 'invalid',
      content: 'this is the content of the comment'
    };

    await supertest(app)
      .post('/comment')
      .send(body)
      .set('Content-Type', 'application/json')
      .expect(400)
      .then(res => {
        expect(res.body.errors.length).toBe(1);
        expect(res.body.errors[0].path).toBe('postId');
      });
  });
  it('content too long', async () => {

    const body = {
      postId: 1,
      content: 'a'.repeat(10001)
    };

    await supertest(app)
      .post('/comment')
      .send(body)
      .set('Content-Type', 'application/json')
      .expect(400)
      .then(res => {
        expect(res.body.errors.length).toBe(1);
        expect(res.body.errors[0].path).toBe('content');
      });
  });
  it('replyId not an integer', async () => {

    const body = {
      postId: 1,
      content: 'this is the content of the comment',
      replyId: 'invalid'
    };

    await supertest(app)
      .post('/comment')
      .send(body)
      .set('Content-Type', 'application/json')
      .expect(400)
      .then(res => {
        expect(res.body.errors.length).toBe(1);
        expect(res.body.errors[0].path).toBe('replyId');
      });
  });
  it('creating comment successful (without replyId)', async () => {
    const body = {
      postId: 1,
      content: 'this is the content of the comment'
    };

    await supertest(app)
      .post('/comment')
      .send(body)
      .set('Content-Type', 'application/json')
      .expect(200);
  });
  it('creating comment successful (with replyId)', async () => {
    const body = {
      postId: 1,
      content: 'this is the content of the comment',
      replyId: 1
    };

    await supertest(app)
      .post('/comment')
      .send(body)
      .set('Content-Type', 'application/json')
      .expect(200);
  });
});
