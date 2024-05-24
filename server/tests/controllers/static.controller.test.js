const { StaticController } = require('../../src/controllers');
const { SubWebbitService } = require('../../src/services');
const { HttpError } = require('../../src/middleware');
const httpMocks = require('node-mocks-http');

jest.mock('../../src/services/subwebbit.service');

describe('StaticController', () => {
  describe('#checkSubWebbitAccess', () => {
    it('SubWebbit does not exist', async () => {
      const response = httpMocks.createResponse();
      const request = httpMocks.createRequest();
      request.originalUrl = "localhost:3000/static/subwebbit/community_pictures/41-random.jpg";

      SubWebbitService.getSubWebbitById.mockResolvedValue(null);

      const error = new HttpError("SubWebbit doesn't exist", 404);
      const nextMock = jest.fn();
      await StaticController.checkSubWebbitAccess(request, response, nextMock);
      expect(nextMock).toHaveBeenCalledWith(error);
      expect(SubWebbitService.checkViewAccess).not.toHaveBeenCalled();
    
    });
    it('View access checked', async () => {

      const response = httpMocks.createResponse();
      const request = httpMocks.createRequest();
      request.originalUrl = "localhost:3000/static/subwebbit/community_pictures/41-random.jpg";

      const subMock = {};
      SubWebbitService.getSubWebbitById.mockResolvedValue(subMock);

      const nextMock = jest.fn();
      await StaticController.checkSubWebbitAccess(request, response, nextMock);
      expect(nextMock).toHaveBeenCalledWith();
      expect(SubWebbitService.checkViewAccess).toHaveBeenCalledWith(request.session, subMock);
      expect(SubWebbitService.getSubWebbitById).toHaveBeenCalledWith(41);
    
    });
  })
});