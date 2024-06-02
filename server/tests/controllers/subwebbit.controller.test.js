const { SubWebbitController } = require('../../src/controllers');
const { SubWebbitService, FileUploaderService } = require('../../src/services');
const httpMocks = require('node-mocks-http');

jest.mock('../../src/services/subwebbit.service');
jest.mock('../../src/services/fileuploader.service');

describe('SubWebbitController', () => {
  describe('#create', () => {
    it('create with name taken', async () => {

      const response = httpMocks.createResponse();
      const request = httpMocks.createRequest();
      const name = 'MockedSubWebbitName';
      request.body = {
        name: name,
        type: 'public',
        adultRated: false
      };

      SubWebbitService.getSubWebbitByName.mockResolvedValue(true);

      const nextMock = jest.fn();
      await SubWebbitController.create(request, response, nextMock);
      expect(nextMock).not.toHaveBeenCalled();
      expect(SubWebbitService.getSubWebbitByName).toHaveBeenCalledWith(name);
      expect(SubWebbitService.createSubWebbit).not.toHaveBeenCalled();
    });
    it('create name not taken', async () => {
      const response = httpMocks.createResponse();
      const request = httpMocks.createRequest();
      const name = 'MockedSubWebbitName';
      request.body = {
        name: name,
        type: 'public',
        adultRated: false
      };
      
      SubWebbitService.getSubWebbitByName.mockResolvedValue(false);

      const nextMock = jest.fn();
      await SubWebbitController.create(request, response, nextMock);
      expect(nextMock).not.toHaveBeenCalled();
      expect(SubWebbitService.getSubWebbitByName).toHaveBeenCalledWith(name);
      expect(SubWebbitService.createSubWebbit).toHaveBeenCalled();
    });
  });
  describe('#delete', () => {
    it('service delete called', async () => {
      const response = httpMocks.createResponse();
      const request = httpMocks.createRequest();

      const nextMock = jest.fn();
      await SubWebbitController.delete(request, response, nextMock);
      expect(nextMock).not.toHaveBeenCalled();
      expect(SubWebbitService.deleteSubwebbitByName).toHaveBeenCalled();

    });
  });

  describe('#updateDescription', () => {
    it('update icon', async () => {
      const response = httpMocks.createResponse();
      const request = httpMocks.createRequest();

      const description = 'new description';
      request.params.name = 'MockedSubWebbitName';
      request.body.description = description;
      let sub = {
        description: ''
      };

      SubWebbitService.updateSubWebbit.mockImplementation((name, session, cb) => {
        cb(sub);
      });

      const nextMock = jest.fn();
      await SubWebbitController.updateDescription(request, response, nextMock);
      expect(nextMock).not.toHaveBeenCalled();
      expect(SubWebbitService.updateSubWebbit).toHaveBeenCalled();
      expect(sub.description).toBe(description);

    });
  });

  describe('#updateBannerIcon', () => {
    it('update icon', async () => {
      const response = httpMocks.createResponse();
      const request = httpMocks.createRequest();

      const newFile = 'newfile.png';
      request.params.name = 'MockedSubWebbitName';
      request.file = { mimetype: 'image/png' };
      let sub = {
        bannerFile: ''
      };

      SubWebbitService.updateSubWebbit.mockImplementation((name, session, cb) => {
        cb(sub);
      });
      FileUploaderService.moveFileAndGenRandomName.mockReturnValue(newFile);

      const nextMock = jest.fn();
      await SubWebbitController.updateBannerIcon(request, response, nextMock);
      expect(nextMock).not.toHaveBeenCalled();
      expect(SubWebbitService.updateSubWebbit).toHaveBeenCalled();
      expect(FileUploaderService.moveFileAndGenRandomName).toHaveBeenCalled();
      expect(sub.bannerFile).toBe(newFile);

    });
  });

  describe('#updateBackgroundIcon', () => {
    it('update icon', async () => {
      const response = httpMocks.createResponse();
      const request = httpMocks.createRequest();

      const newFile = 'newfile.png';
      request.params.name = 'MockedSubWebbitName';
      request.file = { mimetype: 'image/png' };
      let sub = {
        backgroundFile: ''
      };

      SubWebbitService.updateSubWebbit.mockImplementation((name, session, cb) => {
        cb(sub);
      });
      FileUploaderService.moveFileAndGenRandomName.mockReturnValue(newFile);

      const nextMock = jest.fn();
      await SubWebbitController.updateBackgroundIcon(request, response, nextMock);
      expect(nextMock).not.toHaveBeenCalled();
      expect(SubWebbitService.updateSubWebbit).toHaveBeenCalled();
      expect(FileUploaderService.moveFileAndGenRandomName).toHaveBeenCalled();
      expect(sub.backgroundFile).toBe(newFile);

    });
  });

  describe('#updateCommunityIcon', () => {
    it('update icon', async () => {
      const response = httpMocks.createResponse();
      const request = httpMocks.createRequest();

      const newFile = 'newfile.png';
      request.params.name = 'MockedSubWebbitName';
      request.file = { mimetype: 'image/png' };
      let sub = {
        communityFile: ''
      };

      SubWebbitService.updateSubWebbit.mockImplementation((name, session, cb) => {
        cb(sub);
      });
      FileUploaderService.moveFileAndGenRandomName.mockReturnValue(newFile);

      const nextMock = jest.fn();
      await SubWebbitController.updateCommunityIcon(request, response, nextMock);
      expect(nextMock).not.toHaveBeenCalled();
      expect(SubWebbitService.updateSubWebbit).toHaveBeenCalled();
      expect(FileUploaderService.moveFileAndGenRandomName).toHaveBeenCalled();
      expect(sub.communityFile).toBe(newFile);

    });
  });
});