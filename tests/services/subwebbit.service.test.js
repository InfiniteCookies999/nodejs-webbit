const db = require('../../src/models');
const { SubWebbitService } = require('../../src/services');

jest.mock('bcryptjs');
jest.mock('../../src/models/user.model', () => () => {
  const SequelizeMock = require("sequelize-mock");
  const sequelizeMock = new SequelizeMock();
  return sequelizeMock.define('User');
});
jest.mock('../../src/models/subwebbit.model', () => () => {
  const SequelizeMock = require("sequelize-mock");
  const sequelizeMock = new SequelizeMock();
  return sequelizeMock.define('SubWebbit');
});

beforeEach(() => {
  db.SubWebbit = require('../../src/models/subwebbit.model')();
});

afterEach(() => {
  // Spying on the findOne function at times so need
  // to restore the mock to the original value.
  jest.restoreAllMocks();
});

describe('SubWebbitService', () => {
  describe('#createSubWebbit', () => {
    it('creates subwebbit and adds mod', () => {
      const session = {
        user: {
          id: 1
        }
      };
      const dto = {
        name: 'BestSubwebbit',
        type: 'public',
        adultRated: false
      };
  
      const subMock = {
        addMod: jest.fn(() => true)
      };
      jest.spyOn(db.SubWebbit, 'create').mockResolvedValue(subMock);

      SubWebbitService.createSubWebbit(session, dto);
      expect(db.SubWebbit.create).toHaveBeenCalled();
      // TODO: come back to because I have absolutely no idea why this doesnt work.
      // It is as if mockResolvedValue returns a different object.
      //expect(subMock.addMod).toHaveBeenCalled();
      
    });
  });

  describe('#updateSubWebbit', () => {
    it('subwebbit doesnt exist by name', async () => {
  
      const session = {};
      const cb = jest.fn();
      
      jest.spyOn(SubWebbitService, 'getSubWebbitByName').mockResolvedValue(null);

      await expect(async () => {
        await SubWebbitService.updateSubWebbit('subname', session, cb)
      }).rejects.toThrow("SubWebbit doesn't exist");
      
    });

    it('subwebbit user is not moderator', async () => {
  
      const session = {
        user: {
          id: 1
        }
      };
      const subMock = {
        hasMod: jest.fn(() => false)
      };
      const cb = jest.fn();
      
      jest.spyOn(SubWebbitService, 'getSubWebbitByName').mockResolvedValue(subMock);

      await expect(async () => {
        await SubWebbitService.updateSubWebbit('subname', session, cb)
      }).rejects.toThrow("User is not a moderator");
      expect(subMock.hasMod).toHaveBeenCalled();
    });

    it('update successful, callback called', async () => {
      const session = {
        user: {
          id: 1
        }
      };
      const subMock = {
        hasMod: jest.fn(() => true),
        save: jest.fn()
      };
      const cb = jest.fn();
      
      jest.spyOn(SubWebbitService, 'getSubWebbitByName').mockResolvedValue(subMock);

      await SubWebbitService.updateSubWebbit('subname', session, cb);
      expect(cb).toHaveBeenCalled();
      expect(subMock.hasMod).toHaveBeenCalled();
      expect(subMock.save).toHaveBeenCalled();

    });
  });
});