const supertest = require("supertest");
const createApp = require('../../src/create.app');

const app = createApp();

const statusOkMock = (req, res, next) => {
    res.status(200).json({});
}

jest.mock('../../src/controllers/auth.controller', () => {
  return {
    register: statusOkMock,
    login: statusOkMock
  }
});

describe('route /auth/register', () => {
  it('invalid email no address', async () => {
    const body = {
      email: 'infinitecookies959',
      username: 'maddie',
      password: 'reG#@$14as3',
      gender: 'Woman'
    };

    await supertest(app)
      .post('/auth/register')
      .send(body)
      .set('Content-Type', 'application/json')
      .expect(400)
      .then(res => {
        expect(res.body.errors.length).toBe(1);
        expect(res.body.errors[0].path).toBe('email');
      });
  });
  it('invalid email only address', async () => {
    const body = {
      email: '@gmail.com',
      username: 'maddie',
      password: 'reG#@$14as3',
      gender: 'Woman'
    };

    await supertest(app)
      .post('/auth/register')
      .send(body)
      .set('Content-Type', 'application/json')
      .expect(400)
      .then(res => {
        expect(res.body.errors.length).toBe(1);
        expect(res.body.errors[0].path).toBe('email');
      });
  });
  it('invalid username cannot contain special characters', async () => {
    const body = {
      email: 'infinitecookies959@gmail.com',
      username: 'maddie#',
      password: 'reG#@$14as3',
      gender: 'Woman'
    };

    await supertest(app)
      .post('/auth/register')
      .send(body)
      .set('Content-Type', 'application/json')
      .expect(400)
      .then(res => {
        expect(res.body.errors.length).toBe(1);
        expect(res.body.errors[0].path).toBe('username');
      });
  });
  it('invalid username cannot contain spaces', async () => {
    const body = {
      email: 'infinitecookies959@gmail.com',
      username: 'maddie last',
      password: 'reG#@$14as3',
      gender: 'Woman'
    };

    await supertest(app)
      .post('/auth/register')
      .send(body)
      .set('Content-Type', 'application/json')
      .expect(400)
      .then(res => {
        expect(res.body.errors.length).toBe(1);
        expect(res.body.errors[0].path).toBe('username');
      });
  });
  it('invalid password no special characters', async () => {
    const body = {
      email: 'infinitecookies959@gmail.com',
      username: 'maddie',
      password: 'somepassword',
      gender: 'Woman'
    };

    await supertest(app)
      .post('/auth/register')
      .send(body)
      .set('Content-Type', 'application/json')
      .expect(400)
      .then(res => {
        expect(res.body.errors.length).toBe(1);
        expect(res.body.errors[0].path).toBe('password');
      });
  });
  it('invalid gender not in list', async () => {
    const body = {
      email: 'infinitecookies959@gmail.com',
      username: 'maddie',
      password: 'reG#@$14as3',
      gender: 'Bad'
    };

    await supertest(app)
      .post('/auth/register')
      .send(body)
      .set('Content-Type', 'application/json')
      .expect(400)
      .then(res => {
        console.log(res.body.errors);
        expect(res.body.errors.length).toBe(1);
        expect(res.body.errors[0].path).toBe('gender');
      });
  });
  it('valid registration', async () => {
    const body = {
      email: 'infinitecookies959@gmail.com',
      username: 'maddie',
      password: 'reG#@$14as3',
      gender: 'Woman'
    };

    await supertest(app)
      .post('/auth/register')
      .send(body)
      .set('Content-Type', 'application/json')
      .expect(200);
  });
});

describe('route /auth/login', () => {
  it('invalid email or username too long', async () => {
    const body = {
      emailOrUsername: 'this is too long and will not work as being sent',
      password: 'reG#@$14as3'
    };

    await supertest(app)
      .post('/auth/login')
      .send(body)
      .set('Content-Type', 'application/json')
      .expect(400)
      .then(res => {
        expect(res.body.errors.length).toBe(1);
        expect(res.body.errors[0].nestedErrors[0][0].path).toBe('emailOrUsername');
      });
  });
  it('invalid password empty', async () => {
    const body = {
      emailOrUsername: 'maddie',
      password: ''
    };

    await supertest(app)
      .post('/auth/login')
      .send(body)
      .set('Content-Type', 'application/json')
      .expect(400)
      .then(res => {
        expect(res.body.errors.length).toBe(1);
        expect(res.body.errors[0].path).toBe('password');
      });
  });
  it('valid login', async () => {
    const body = {
      emailOrUsername: 'maddie',
      password: 'reG#@$14as3'
    };

    await supertest(app)
      .post('/auth/login')
      .send(body)
      .set('Content-Type', 'application/json')
      .expect(200);
  });
});