const { PostController } = require('../../src/controllers');
const { PostService } = require('../../src/services');
const httpMocks = require('node-mocks-http');

jest.mock('../../src/services/post.service');

describe('PostController', () => {
  describe('#create', () => {
    it('create without media', async () => {

      const response = httpMocks.createResponse();
      const request = httpMocks.createRequest();

      const postMock = {};
      PostService.createPost.mockResolvedValue(postMock);

      const nextMock = jest.fn();
      await PostController.create(request, response, nextMock);
      expect(nextMock).not.toHaveBeenCalled();
      expect(PostService.createPost).toHaveBeenCalled();
      expect(PostService.addPostMedia).not.toHaveBeenCalled();
    
    });
    it('create with media', async () => {

      const response = httpMocks.createResponse();
      const request = httpMocks.createRequest();
      request.files = [
        {
          mimetype: "image/png"
        }
      ];

      const postMock = {};
      PostService.createPost.mockResolvedValue(postMock);

      const nextMock = jest.fn();
      await PostController.create(request, response, nextMock);
      expect(nextMock).not.toHaveBeenCalled();
      expect(PostService.createPost).toHaveBeenCalled();
      expect(PostService.addPostMedia).toHaveBeenCalled();
    
    });
  });
});