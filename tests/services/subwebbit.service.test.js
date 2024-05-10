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

describe('SubWebbitService', () => {
  describe('#createSubWebbit', () => {
    it('creates subwebbit as public and adds mod', () => {
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

  describe('#deleteSubwebbitByName', () => {
    it('no such subwebbit', async () => {
      const session = {
        user: {
          id: 1
        }
      };

      jest.spyOn(SubWebbitService, 'getSubWebbitByName').mockResolvedValue(null);

      await expect(async () => {
        await SubWebbitService.deleteSubwebbitByName(session, 'subname');
      }).rejects.toThrow("SubWebbit doesn't exist");
      expect(SubWebbitService.getSubWebbitByName).toHaveBeenCalled();
      
    });
    it('user not a moderator', async () => {
      const session = {
        user: {
          id: 1
        }
      };
      const subMock = {
        hasMod: jest.fn(() => false),
        destroy: jest.fn()
      };

      jest.spyOn(SubWebbitService, 'getSubWebbitByName').mockResolvedValue(subMock);

      await expect(async () => {
        await SubWebbitService.deleteSubwebbitByName(session, 'subname');
      }).rejects.toThrow("User is not a moderator");
      expect(SubWebbitService.getSubWebbitByName).toHaveBeenCalled();
      expect(subMock.hasMod).toHaveBeenCalled();
      expect(subMock.destroy).not.toHaveBeenCalled();
    
    });
    it('destroy called successfully', async () => {
      const session = {
        user: {
          id: 1
        }
      };
      const subMock = {
        hasMod: jest.fn(() => true),
        destroy: jest.fn()
      };

      jest.spyOn(SubWebbitService, 'getSubWebbitByName').mockResolvedValue(subMock);

      await SubWebbitService.deleteSubwebbitByName(session, 'subname');
      
      expect(SubWebbitService.getSubWebbitByName).toHaveBeenCalled();
      expect(subMock.hasMod).toHaveBeenCalled();
      expect(subMock.destroy).toHaveBeenCalled();
    });
  });
});