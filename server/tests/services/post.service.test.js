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
jest.mock('../../src/models/user.model', () => () => {
  const SequelizeMock = require("sequelize-mock");
  const sequelizeMock = new SequelizeMock();
  return sequelizeMock.define('User');
});

beforeEach(() => {
  db.Post = require('../../src/models/post.media.model')();
  db.PostMedia = require('../../src/models/post.media.model')();
  db.User = require('../../src/models/user.model')();
});

afterEach(() => {
  jest.restoreAllMocks();
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
    it('user does not have authorization to delete post', async () => {

      const session = {
        user: {
          id: 1
        }
      };
      const postMock = {
        UserId: 5,
        SubWebbit: {
          hasMod: jest.fn(() => false)
        }
      };

      jest.spyOn(PostService, 'getPost').mockResolvedValue(postMock);

      await expect(async () => {
        await PostService.deletePost(session, 1);
      }).rejects.toThrow("Not user's post");
    });
    it('post delete successfull', async () => {
      
      const session = {
        user: {
          id: 1
        }
      };
      const postMock = {
        UserId: 1,
        destroy: jest.fn(),
        SubWebbit: {
          hasMod: jest.fn(() => false)
        }
      };

      jest.spyOn(PostService, 'getPost').mockResolvedValue(postMock);

      await PostService.deletePost(session, 1);
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

  describe('#getPost', () => {
    it('post does not exist', async () => {

      db.Post.findByPk = jest.fn(() => null);

      await expect(async () => {
        await PostService.getPost(1);
      }).rejects.toThrow("Post doesn't exist");
    });
  });

  describe('#likePost', () => {
    it('liked post (no existing like)', async () => {

      const session = {
        user: {
          id: 1
        }
      };
      const postMock = {
        User: { // poster
          id: 2,
          postKarma: 0,
          save: jest.fn()
        },
        save: jest.fn()
      };
      const userMock = {
        id: 1,
        hasPostLike: jest.fn(() => false),
        addPostLike: jest.fn(),
        hasPostDislike: jest.fn(() => false),
        removePostDislike: jest.fn()
      };
      
      jest.spyOn(PostService, 'getPost').mockResolvedValue(postMock);
      db.User.findByPk = jest.fn(() => userMock);

      await PostService.likePost(session, 1);
      expect(userMock.hasPostLike).toHaveBeenCalled();
      expect(userMock.addPostLike).toHaveBeenCalled();
      expect(userMock.hasPostDislike).toHaveBeenCalled();
      expect(userMock.removePostDislike).not.toHaveBeenCalled();
      expect(postMock.User.save).toHaveBeenCalled();
      expect(postMock.save).toHaveBeenCalled();
      expect(postMock.User.postKarma).toBe(1);
      
    });
    it('liked post (has existing like)', async () => {

      const session = {
        user: {
          id: 1
        }
      };
      const postMock = {
        User: { // poster
          id: 2,
          postKarma: 1,
          save: jest.fn()
        },
        save: jest.fn()
      };
      const userMock = {
        id: 1,
        hasPostLike: jest.fn(() => true),
        removePostLike: jest.fn(),
        hasPostDislike: jest.fn(() => false),
        removePostDislike: jest.fn()
      };
      
      jest.spyOn(PostService, 'getPost').mockResolvedValue(postMock);
      db.User.findByPk = jest.fn(() => userMock);

      await PostService.likePost(session, 1);
      expect(userMock.hasPostLike).toHaveBeenCalled();
      expect(userMock.removePostLike).toHaveBeenCalled();
      expect(userMock.hasPostDislike).toHaveBeenCalled();
      expect(userMock.removePostDislike).not.toHaveBeenCalled();
      expect(postMock.User.save).toHaveBeenCalled();
      expect(postMock.save).toHaveBeenCalled();
      expect(postMock.User.postKarma).toBe(0);

    });
    it('liked post (has existing dislike)', async () => {

      const session = {
        user: {
          id: 1
        }
      };
      const postMock = {
        User: { // poster
          id: 2,
          postKarma: 1,
          save: jest.fn()
        },
        save: jest.fn()
      };
      const userMock = {
        id: 1,
        hasPostLike: jest.fn(() => true),
        removePostLike: jest.fn(),
        hasPostDislike: jest.fn(() => true),
        removePostDislike: jest.fn()
      };
      
      jest.spyOn(PostService, 'getPost').mockResolvedValue(postMock);
      db.User.findByPk = jest.fn(() => userMock);

      await PostService.likePost(session, 1);
      expect(userMock.hasPostLike).toHaveBeenCalled();
      expect(userMock.removePostLike).toHaveBeenCalled();
      expect(userMock.hasPostDislike).toHaveBeenCalled();
      expect(userMock.removePostDislike).toHaveBeenCalled();
      expect(postMock.User.save).toHaveBeenCalled();
      expect(postMock.save).toHaveBeenCalled();
      expect(postMock.User.postKarma).toBe(1);

    });
  });

  describe('#dislikePost', () => {
    it('disliked post (no existing dislike)', async () => {

      const session = {
        user: {
          id: 1
        }
      };
      const postMock = {
        User: { // poster
          id: 2,
          postKarma: 0,
          save: jest.fn()
        },
        save: jest.fn()
      };
      const userMock = {
        id: 1,
        hasPostDislike: jest.fn(() => false),
        addPostDislike: jest.fn(),
        hasPostLike: jest.fn(() => false),
        removePostLike: jest.fn(),
      };
      
      jest.spyOn(PostService, 'getPost').mockResolvedValue(postMock);
      db.User.findByPk = jest.fn(() => userMock);

      await PostService.dislikePost(session, 1);
      expect(userMock.hasPostDislike).toHaveBeenCalled();
      expect(userMock.addPostDislike).toHaveBeenCalled();
      expect(userMock.hasPostLike).toHaveBeenCalled();
      expect(userMock.removePostLike).not.toHaveBeenCalled();
      expect(postMock.User.save).toHaveBeenCalled();
      expect(postMock.save).toHaveBeenCalled();
      expect(postMock.User.postKarma).toBe(-1);
      
    });
    it('disliked post (has existing dislike)', async () => {

      const session = {
        user: {
          id: 1
        }
      };
      const postMock = {
        User: { // poster
          id: 2,
          postKarma: 0,
          save: jest.fn()
        },
        save: jest.fn()
      };
      const userMock = {
        id: 1,
        hasPostDislike: jest.fn(() => true),
        removePostDislike: jest.fn(),
        hasPostLike: jest.fn(() => false),
        removePostLike: jest.fn(),
      };
      
      jest.spyOn(PostService, 'getPost').mockResolvedValue(postMock);
      db.User.findByPk = jest.fn(() => userMock);

      await PostService.dislikePost(session, 1);
      expect(userMock.hasPostDislike).toHaveBeenCalled();
      expect(userMock.removePostDislike).toHaveBeenCalled();
      expect(userMock.hasPostLike).toHaveBeenCalled();
      expect(userMock.removePostLike).not.toHaveBeenCalled();
      expect(postMock.User.save).toHaveBeenCalled();
      expect(postMock.save).toHaveBeenCalled();
      expect(postMock.User.postKarma).toBe(1);

    });
    it('disliked post (has existing like)', async () => {

      const session = {
        user: {
          id: 1
        }
      };
      const postMock = {
        User: { // poster
          id: 2,
          postKarma: 0,
          save: jest.fn()
        },
        save: jest.fn()
      };
      const userMock = {
        id: 1,
        hasPostDislike: jest.fn(() => true),
        removePostDislike: jest.fn(),
        hasPostLike: jest.fn(() => true),
        removePostLike: jest.fn(),
      };
      
      jest.spyOn(PostService, 'getPost').mockResolvedValue(postMock);
      db.User.findByPk = jest.fn(() => userMock);

      await PostService.dislikePost(session, 1);
      expect(userMock.hasPostDislike).toHaveBeenCalled();
      expect(userMock.removePostDislike).toHaveBeenCalled();
      expect(userMock.hasPostLike).toHaveBeenCalled();
      expect(userMock.removePostLike).toHaveBeenCalled();
      expect(postMock.User.save).toHaveBeenCalled();
      expect(postMock.save).toHaveBeenCalled();
      expect(postMock.User.postKarma).toBe(0);

    });
  });
});