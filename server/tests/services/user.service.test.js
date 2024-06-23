const db = require('../../src/models');
const { UserService } = require('../../src/services');
const bcrypt = require('bcryptjs');

jest.mock('bcryptjs');
jest.mock('../../src/models/user.model', () => () => {
  const SequelizeMock = require("sequelize-mock");
  const sequelizeMock = new SequelizeMock();
  return sequelizeMock.define('User', {
    id: 0,
    email: 'infinitecookies959@gmail.com',
    username: 'maddie',
    password: 'hashed password'
  });
});

beforeEach(() => {
  db.User = require('../../src/models/user.model')();
});

afterEach(() => {
  // Spying on the findOne function at times so need
  // to restore the mock to the original value.
  jest.restoreAllMocks();
});

describe('UserService', () => {
    
  describe('#registerUser', () => {
    it('register given user', async () => {

      jest.spyOn(db.User, 'create');

      const password = 'my password';
      await UserService.registerUser('infinitecookies959@gmail.com', 'maddie', password, 'Woman');
      expect(db.User.create).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith(password, expect.any(Number));

    });
  });

  describe('#checkUserCredentials', () => {
    
    const email = 'infinitecookies959@gmail.com';
    const username = 'maddie';
    const password = 'haQ2#2f21';
    
    it('check for email does not exist', async () => {

      jest.spyOn(db.User, 'findOne').mockReturnValue(null);
      
      const result = await UserService.checkUserCredentials('bademail@gmail.com', password, true);
      expect(result).toBe(false);
      expect(bcrypt.compare).not.toHaveBeenCalled();

    });
    it('check for email exists password does not match', async () => {

      bcrypt.compare.mockReturnValue(false);
      
      const result = await UserService.checkUserCredentials(email, password, true);
      expect(result).toBe(false);
      expect(bcrypt.compare).toHaveBeenCalled();

    });
    it('check for email and password matches', async () => {

      bcrypt.compare.mockReturnValue(true);
      
      const result = await UserService.checkUserCredentials(email, password, true);
      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalled();
    
    });
    it('check for username does not exist', async () => {

      jest.spyOn(db.User, 'findOne').mockReturnValue(null);

      const result = await UserService.checkUserCredentials(username, password, false);
      expect(result).toBe(false);
      expect(bcrypt.compare).not.toHaveBeenCalled();

    });
    it('check for username exists password does not match', async () => {

      bcrypt.compare.mockReturnValue(false);
      
      const result = await UserService.checkUserCredentials(username, password, false);
      expect(result).toBe(false);
      expect(bcrypt.compare).toHaveBeenCalled();

    });
    it('check for username and password matches', async () => {

      bcrypt.compare.mockReturnValue(true);
      
      const result = await UserService.checkUserCredentials(username, password, false);
      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalled();
    
    });
  });

  describe('updateEmail', () => {
    it('wrong password', async () => {

      const userMock = {
        save: jest.fn()
      };

      bcrypt.compare.mockReturnValue(false);

      db.User.findByPk = jest.fn(() => userMock);

      await expect(async () => {
        await UserService.updateEmail(1, "bestuser1@gmail.com", "my_secret_password214");
      }).rejects.toThrow("Invalid password");
      expect(userMock.save).not.toHaveBeenCalled();

    });
    it('successful update', async () => {

      const newEmail = "bestuser1@gmail.com";

      const userMock = {
        save: jest.fn(),
        email: "oldemail@gmail.com"
      };

      bcrypt.compare.mockReturnValue(true);

      db.User.findByPk = jest.fn(() => userMock);
      
      await UserService.updateEmail(1, newEmail, "my_secret_password214");
      expect(userMock.save).toHaveBeenCalled();
      expect(userMock.email).toBe(newEmail);
      expect(bcrypt.compare).toHaveBeenCalled();

    });

    describe('updatePassword', () => {
      it('wrong password', async () => {

        const userMock = {
          save: jest.fn()
        };

        bcrypt.compare.mockReturnValue(false);

        db.User.findByPk = jest.fn(() => userMock);

        await expect(async () => {
          await UserService.updatePassword(1, "newpassword", "oldpassword");
        }).rejects.toThrow("Invalid password");
        expect(userMock.save).not.toHaveBeenCalled();

      });
      it('successful update', async () => {

        const oldPassword = "oldpassword";
        const hashedPassword = "password_but_hashed";

        const userMock = {
          save: jest.fn(),
          password: oldPassword
        };

        bcrypt.compare.mockReturnValue(true);
        bcrypt.hash.mockReturnValue(hashedPassword);

        db.User.findByPk = jest.fn(() => userMock);

        await UserService.updatePassword(1, "newPassword", oldPassword);
        expect(userMock.save).toHaveBeenCalled();
        expect(userMock.password).toBe(hashedPassword);
        expect(bcrypt.compare).toHaveBeenCalled();
        expect(bcrypt.hash).toHaveBeenCalled();

      });
    });
  })
});