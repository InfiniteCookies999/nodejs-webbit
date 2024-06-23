const supertest = require("supertest");
const createApp = require('../../src/create.app');

const app = createApp();

const statusOkMock = (req, res, next) => {
  res.status(200).json({});
}

jest.mock('../../src/controllers/auth.controller', () => {
  const Controller = jest.requireActual('../../src/controllers/auth.controller');
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

describe('route POST /api/auth/register', () => {
  it('invalid email no address', async () => {
    const body = {
      email: 'infinitecookies959',
      username: 'maddie',
      password: 'reG#@$14as3'
    };

    await supertest(app)
      .post('/api/auth/register')
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
      password: 'reG#@$14as3'
    };

    await supertest(app)
      .post('/api/auth/register')
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
      password: 'reG#@$14as3'
    };

    await supertest(app)
      .post('/api/auth/register')
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
      password: 'reG#@$14as3'
    };

    await supertest(app)
      .post('/api/auth/register')
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
      password: 'somepassword'
    };

    await supertest(app)
      .post('/api/auth/register')
      .send(body)
      .set('Content-Type', 'application/json')
      .expect(400)
      .then(res => {
        expect(res.body.errors.length).toBe(1);
        expect(res.body.errors[0].path).toBe('password');
      });
  });
  it('valid registration', async () => {
    const body = {
      email: 'infinitecookies959@gmail.com',
      username: 'maddie',
      password: 'reG#@$14as3'
    };

    await supertest(app)
      .post('/api/auth/register')
      .send(body)
      .set('Content-Type', 'application/json')
      .expect(200);
  });
});

describe('route POST /auth/login', () => {
  it('invalid email or username too long', async () => {
    const body = {
      emailOrUsername: 'this is too long and will not work as being sent',
      password: 'reG#@$14as3'
    };

    await supertest(app)
      .post('/api/auth/login')
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
      .post('/api/auth/login')
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
      .post('/api/auth/login')
      .send(body)
      .set('Content-Type', 'application/json')
      .expect(200);
  });
});

describe('route PUT /auth/email', () => {
  it('invalid email no address', async () => {
    const body = {
      email: 'infinitecookies959',
      password: 'reG#@$14as3'
    };

    await supertest(app)
      .put('/api/auth/email')
      .send(body)
      .set('Content-Type', 'application/json')
      .expect(400)
      .then(res => {
        expect(res.body.errors.length).toBe(1);
        expect(res.body.errors[0].path).toBe('email');
      });
  });
  it('invalid password is empty', async () => {
    const body = {
      email: 'infinitecookies959@gmail.com',
      password: ''
    };

    await supertest(app)
      .put('/api/auth/email')
      .send(body)
      .set('Content-Type', 'application/json')
      .expect(400)
      .then(res => {
        expect(res.body.errors.length).toBe(1);
        expect(res.body.errors[0].path).toBe('password');
      });
  });
  it('successful update', async () => {
    const body = {
      email: 'infinitecookies959@gmail.com',
      password: 'reG#@$14as3'
    };

    await supertest(app)
      .put('/api/auth/email')
      .send(body)
      .set('Content-Type', 'application/json')
      .expect(200);
  });
});

describe('route PUT /auth/password', () => {
  it('currentPassword is empty', async () => {
    const body = {
      currentPassword: '',
      newPassword: 'reG#@$14as3'
    };

    await supertest(app)
      .put('/api/auth/password')
      .send(body)
      .set('Content-Type', 'application/json')
      .expect(400)
      .then(res => {
        expect(res.body.errors.length).toBe(1);
        expect(res.body.errors[0].path).toBe('currentPassword');
      });
  });
  it('invalid newPassword no special characters', async () => {
    const body = {
      currentPassword: 'reG#@$14as3',
      newPassword: 'somepassword'
    };

    await supertest(app)
      .put('/api/auth/password')
      .send(body)
      .set('Content-Type', 'application/json')
      .expect(400)
      .then(res => {
        expect(res.body.errors.length).toBe(1);
        expect(res.body.errors[0].path).toBe('newPassword');
      });
  });
  it('successful update', async () => {
    const body = {
      currentPassword: 'reG#@$14as3',
      newPassword: 'kuy#@gseD312'
    };

    await supertest(app)
      .put('/api/auth/password')
      .send(body)
      .set('Content-Type', 'application/json')
      .expect(200);
  });
});