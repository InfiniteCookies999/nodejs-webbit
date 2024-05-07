const supertest = require("supertest");
const createApp = require('../../src/create.app');

const app = createApp();

const statusOkMock = (req, res, next) => {
  res.status(200).json({});
}

jest.mock('../../src/controllers/subwebbit.controller', () => {
  return {
    create: statusOkMock,
    updateDescription: statusOkMock,
    updateBannerIcon: statusOkMock,
    updateBackgroundIcon: statusOkMock,
    updateCommunityIcon: statusOkMock
  }
});
jest.mock('../../src/middleware/validation', () => {
  return {
    ...jest.requireActual('../../src/middleware/validation'),
    validateLogin: jest.fn((req, res, next) => next())
  }
});


describe('route POST /subwebbit', () => {
  it('name not alphanumeric', async () => {
    const body = {
      name: 'newsubwebbit$^',
      type: 'public',
      adultRated: false
    };

    await supertest(app)
      .post('/subwebbit')
      .send(body)
      .set('Content-Type', 'application/json')
      .expect(400)
      .then(res => {
        expect(res.body.errors.length).toBe(1);
        expect(res.body.errors[0].path).toBe('name');
      });
  });
  it('name too long', async () => {
    const body = {
      name: 'newsubwebbitwithareallylongnamethatdefinitelywillnotbeallowedbecausegreaterthanforty',
      type: 'public',
      adultRated: false
    };

    await supertest(app)
      .post('/subwebbit')
      .send(body)
      .set('Content-Type', 'application/json')
      .expect(400)
      .then(res => {
        expect(res.body.errors.length).toBe(1);
        expect(res.body.errors[0].path).toBe('name');
      });
  });
  it('type not within list', async () => {
    const body = {
      name: 'newsubwebbit',
      type: 'other',
      adultRated: false
    };

    await supertest(app)
      .post('/subwebbit')
      .send(body)
      .set('Content-Type', 'application/json')
      .expect(400)
      .then(res => {
        expect(res.body.errors.length).toBe(1);
        expect(res.body.errors[0].path).toBe('type');
      });
  });
  it('adultRated not boolean', async () => {
    const body = {
      name: 'newsubwebbit',
      type: 'public',
      adultRated: 55
    };

    await supertest(app)
      .post('/subwebbit')
      .send(body)
      .set('Content-Type', 'application/json')
      .expect(400)
      .then(res => {
        expect(res.body.errors.length).toBe(1);
        expect(res.body.errors[0].path).toBe('adultRated');
      });
  });
  it('successful creation of subwebbit', async () => {
    const body = {
      name: 'newsubwebbit',
      type: 'public',
      adultRated: false
    };

    await supertest(app)
      .post('/subwebbit')
      .send(body)
      .set('Content-Type', 'application/json')
      .expect(200);
  });
});

describe('route PUT /subwebbit/:name/description', () => {
  it('length too long', async () => {
    const body = {
      description: 'a'.repeat(501)
    };

    await supertest(app)
      .put('/subwebbit/newsubwebbit/description')
      .send(body)
      .set('Content-Type', 'application/json')
      .expect(400)
      .then(res => {
        expect(res.body.errors.length).toBe(1);
        expect(res.body.errors[0].path).toBe('description');
      });
  });
  it('update successful', async () => {
    const body = {
      description: 'new description'
    };

    await supertest(app)
      .put('/subwebbit/newsubwebbit/description')
      .send(body)
      .set('Content-Type', 'application/json')
      .expect(200);
  });
});
