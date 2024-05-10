const db = require('../../src/models');
const { PostService,
        SubWebbitService,
        FileUploaderService } = require('../../src/services');

jest.mock('../../src/services/subwebbit.service');
jest.mock('../../src/services/fileuploader.service');
jest.mock('../../src/models/post.model', () => () => {
  const SequelizeMock = require("sequelize-mock");
  const sequelizeMock = new SequelizeMock();
  return sequelizeMock.define('Post');
});
jest.mock('../../src/models/post.media.model', () => () => {
  const SequelizeMock = require("sequelize-mock");
  const sequelizeMock = new SequelizeMock();
  return sequelizeMock.define('PostMedia');
});

beforeEach(() => {
  db.Post = require('../../src/models/post.media.model')();
  db.PostMedia = require('../../src/models/post.media.model')();
});

describe('PostService', () => {
  describe('#createPost', () => {
    it('subwebbit does not exist', async () => {

      SubWebbitService.getSubWebbitByName.mockResolvedValue(null);

      await expect(async () => {
        await PostService.createPost('subname');
      }).rejects.toThrow("SubWebbit doesn't exist");

    });
    it('user does not have authorization', async () => {

      const session = {
        user: {
          id: 1
        }
      };
      const subMock = {
        type: 'private',
        hasAuthorizedUser: jest.fn(() => false)
      };

      SubWebbitService.getSubWebbitByName.mockResolvedValue(subMock);

      await expect(async () => {
        await PostService.createPost('subname', session);
      }).rejects.toThrow("User not allowed to post");
      expect(subMock.hasAuthorizedUser).toHaveBeenCalled();

    });
    it('successfull creation of post', async () => {
      
      const session = {
        user: {
          id: 1
        }
      };
      const subMock = {
        type: 'public',
        hasAuthorizedUser: jest.fn(() => false),
        id: 1
      };
      const bodyMock = {
        title: 'post title',
        body: 'this is the contents of the post'
      };

      SubWebbitService.getSubWebbitByName.mockResolvedValue(subMock);

      jest.spyOn(db.Post, 'create').mockResolvedValue(undefined);

      await PostService.createPost('subname', session, bodyMock);
      expect(db.Post.create).toHaveBeenCalled();
      
    });
  });

  describe('#deletePost', () => {
    it('subwebbit does not exist', async () => {

      SubWebbitService.getSubWebbitByName.mockResolvedValue(null);

      await expect(async () => {
        await PostService.deletePost('subname');
      }).rejects.toThrow("SubWebbit doesn't exist");

    });
    it('post does not exist', async () => {

      const session = {
        user: {
          id: 1
        }
      };
      const subMock = {};

      SubWebbitService.getSubWebbitByName.mockResolvedValue(subMock);

      // TODO: why does findByPk not seem to exist for the mocked sequelize version?
      db.Post.findByPk = jest.fn(() => null);

      await expect(async () => {
        await PostService.deletePost('subname', session, 1);
      }).rejects.toThrow("Post doesn't exist");

    });
    it('user does not have authorization to delete post', async () => {

      const session = {
        user: {
          id: 1
        }
      };
      const subMock = {
        hasMod: jest.fn(() => false)
      };
      const postMock = {
        UserId: 5
      };

      SubWebbitService.getSubWebbitByName.mockResolvedValue(subMock);

      // TODO: why does findByPk not seem to exist for the mocked sequelize version?
      db.Post.findByPk = jest.fn(() => postMock);

      await expect(async () => {
        await PostService.deletePost('subname', session, 1);
      }).rejects.toThrow("Not user's post");
    });
    it('post delete successfull', async () => {
      
      const session = {
        user: {
          id: 1
        }
      };
      const subMock = {
        hasMod: jest.fn(() => false)
      };
      const postMock = {
        UserId: 1,
        destroy: jest.fn()
      };

      SubWebbitService.getSubWebbitByName.mockResolvedValue(subMock);

      // TODO: why does findByPk not seem to exist for the mocked sequelize version?
      db.Post.findByPk = jest.fn(() => postMock);

      await PostService.deletePost('subname', session, 1);
      expect(postMock.destroy).toHaveBeenCalled();

    });
  });

  describe('#addPostMedia', () => {
    it('uploads files', async () => {
      
      const postMock = {
        addPostMedia: jest.fn()
      };
      const files = [
        {
          mimetype: "image/png"
        },
        {
          mimetype: "image/jpg"
        }
      ];

      FileUploaderService.moveFileAndGenRandomName.mockReturnValue('randomfile');

      await PostService.addPostMedia(postMock, files);
      expect(FileUploaderService.moveFileAndGenRandomName).toHaveBeenCalledTimes(2);
      expect(postMock.addPostMedia).toHaveBeenCalledTimes(2);

    });
  });
});