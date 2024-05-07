const { AuthController } = require('../../src/controllers');
const { UserService } = require('../../src/services');
const httpMocks = require('node-mocks-http');

jest.mock('../../src/services/user.service');

describe('AuthController', () => {
  describe('#register', () => {
    it('email taken ', async () => {
      const response = httpMocks.createResponse();
      const request = httpMocks.createRequest();
      const email = 'infinitecookies959@gmail.com';
      request.body = {
        email: email,
        username: 'maddie',
        password: 'my password'
      };

      UserService.getUserByUsername.mockResolvedValue(false);
      UserService.getUserByEmail.mockResolvedValue(true);

      const nextMock = jest.fn();
      await AuthController.register(request, response, nextMock);
      expect(nextMock).not.toHaveBeenCalled();
      expect(UserService.getUserByEmail).toHaveBeenCalledWith(email);
      expect(response._getJSONData().status).toBe("email taken");
    });
    it('username taken ', async () => {
      const response = httpMocks.createResponse();
      const request = httpMocks.createRequest();
      const username = 'maddie';
      request.body = {
        email: 'infinitecookies959@gmail.com',
        username: username,
        password: 'my password'
      };

      UserService.getUserByUsername.mockResolvedValue(true);
      UserService.getUserByEmail.mockResolvedValue(false);
      
      const nextMock = jest.fn();
      await AuthController.register(request, response, nextMock);
      expect(nextMock).not.toHaveBeenCalled();
      expect(UserService.getUserByUsername).toHaveBeenCalledWith(username);
      expect(response._getJSONData().status).toBe("username taken");
    });
    it('successful registration', async () => {
      const response = httpMocks.createResponse();
      const request = httpMocks.createRequest();

      const email = 'infinitecookies959@gmail.com';
      const username = 'maddie';
      const password = 'my password';
      const gender = 'Woman';

      request.body = {
        email: email,
        username: username,
        password: password,
        gender: gender
      };

      UserService.getUserByUsername.mockResolvedValue(false);
      UserService.getUserByEmail.mockResolvedValue(false);

      const nextMock = jest.fn();
      await AuthController.register(request, response, nextMock);
      expect(nextMock).not.toHaveBeenCalled();
      expect(response._getJSONData().status).toBe("success");
      expect(UserService.registerUser).toHaveBeenCalledWith(email, username, password, gender);
    });
  });

  describe('#login', () => {
    it('invalid credentials w/ username', async () => {
      const response = httpMocks.createResponse();
      const request = httpMocks.createRequest();
      const emailOrUsername = 'maddie';
      const password = 'my password';
      request.body = {
        emailOrUsername: emailOrUsername,
        password: password
      };

      UserService.checkUserCredentials.mockResolvedValue(false);

      const nextMock = jest.fn();
      await AuthController.login(request, response, nextMock);
      expect(nextMock).not.toHaveBeenCalled();
      expect(response._getJSONData().status).toBe("invalid credentials");
      expect(UserService.checkUserCredentials).toHaveBeenCalledWith(emailOrUsername, password, false);
    });
    it('invalid credentials w/ email', async () => {
      const response = httpMocks.createResponse();
      const request = httpMocks.createRequest();
      const emailOrUsername = 'infinitecookies959@gmail.com';
      const password = 'my password';
      request.body = {
        emailOrUsername: emailOrUsername,
        password: password
      };

      UserService.checkUserCredentials.mockReturnValue(false);

      const nextMock = jest.fn();
      await AuthController.login(request, response, nextMock);
      expect(nextMock).not.toHaveBeenCalled();
      expect(response._getJSONData().status).toBe("invalid credentials");
      expect(UserService.checkUserCredentials).toHaveBeenCalledWith(emailOrUsername, password, true);
    });
    it('valid credentials /w username', async () => {
      const response = httpMocks.createResponse();
      const request = httpMocks.createRequest();
      const emailOrUsername = 'maddie';
      const password = 'my password';
      request.body = {
        emailOrUsername: emailOrUsername,
        password: password
      };
      request.session = {}

      UserService.checkUserCredentials.mockResolvedValue(true);

      const mockNext = jest.fn();
      await AuthController.login(request, response, mockNext);
      expect(mockNext).not.toHaveBeenCalled();
      expect(response._getJSONData().status).toBe("success");
      expect(UserService.getUserByEmail).not.toHaveBeenCalled();
      expect(request.session.user).not.toBeUndefined();
    });
    it('valid credentials /w email', async () => {
      const response = httpMocks.createResponse();
      const request = httpMocks.createRequest();
      const emailOrUsername = 'infinitecookies959@gmail.com';
      const password = 'my password';
      request.body = {
        emailOrUsername: emailOrUsername,
        password: password
      };
      request.session = {}

      UserService.checkUserCredentials.mockResolvedValue(true);
      UserService.getUserByEmail.mockResolvedValue('maddie');

      const mockNext = jest.fn();
      await AuthController.login(request, response, mockNext);
      expect(mockNext).not.toHaveBeenCalled();
      expect(response._getJSONData().status).toBe("success");
      expect(UserService.getUserByEmail).toHaveBeenCalled();
      expect(request.session.user).not.toBeUndefined();
    });
  });
});