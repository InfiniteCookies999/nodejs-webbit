const db = require('../../src/models');
const { CommentService, PostService } = require('../../src/services');

jest.mock('../../src/services/post.service');
jest.mock('../../src/services/subwebbit.service');
jest.mock('../../src/models/comment.model', () => () => {
  const SequelizeMock = require("sequelize-mock");
  const sequelizeMock = new SequelizeMock();
  return sequelizeMock.define('Comment');
});
jest.mock('../../src/models/user.model', () => () => {
  const SequelizeMock = require("sequelize-mock");
  const sequelizeMock = new SequelizeMock();
  return sequelizeMock.define('User');
});

beforeEach(() => {
  db.Comment = require('../../src/models/comment.model')();
  db.User = require('../../src/models/user.model')();
});

describe('CommentService', () => {
  describe('#createComment', () => {
    it('create comment without reply', async () => {

      const session = {
        user: {
          id: 1
        }
      };
      const postMock = {
        SubWebbit: {
          id: 1
        },
        addComment: jest.fn()
      };

      jest.spyOn(db.Comment, 'create').mockResolvedValue(undefined);
      PostService.getPost.mockResolvedValue(postMock);

      await CommentService.createComment(session, 1, undefined, "content of comment");
      expect(db.Comment.create).toHaveBeenCalled();
      expect(postMock.addComment).toHaveBeenCalled();

    });
    it('create comment with reply to comment that does not exist', async () => {
      
      const session = {
        user: {
          id: 1
        }
      };
      const postMock = {
        SubWebbit: {
          id: 1
        },
        addComment: jest.fn()
      };

      jest.spyOn(db.Comment, 'create').mockResolvedValue(undefined);
      db.Comment.findByPk = jest.fn(() => null);
      PostService.getPost.mockResolvedValue(postMock);

      await expect(async () => {
        await CommentService.createComment(session, 1, 1, "content of comment");
      }).rejects.toThrow("Could not find comment for reply");
      expect(db.Comment.create).not.toHaveBeenCalled();
      expect(postMock.addComment).not.toHaveBeenCalled();

    });
    it('it create comment with reply successfully', async () => {

      const session = {
        user: {
          id: 1
        }
      };
      const postMock = {
        SubWebbit: {
          id: 1
        },
        addComment: jest.fn()
      };
      const replyCommentMock = {};

      jest.spyOn(db.Comment, 'create').mockResolvedValue(undefined);
      db.Comment.findByPk = jest.fn(() => replyCommentMock);
      PostService.getPost.mockResolvedValue(postMock);

      await CommentService.createComment(session, 1, 1, "content of comment");
      expect(db.Comment.create).toHaveBeenCalled();
      expect(postMock.addComment).toHaveBeenCalled();

    });
  });

  describe('#deleteComment', () => {
    it('comment does not exist', async () => {

      const session = {};
      db.Comment.findByPk = jest.fn(() => null);

      await expect(async () => {
        await CommentService.deleteComment(session, 1);
      }).rejects.toThrow("Comment doesn't exist");

    });
    it('User does not have authorization to delete comment', async () => {

      const session = {
        user: {
          id: 1
        }
      };
      const commentMock = {
        User: {
          id: 2
        },
        SubWebbit: {
          hadMod: jest.fn(() => false)
        }
      };

      db.Comment.findByPk = jest.fn(() => commentMock);

      await expect(async () => {
        await CommentService.deleteComment(session, 1);
      }).rejects.toThrow("Not User's comment");

    });
    it('delete comment successfull', async () => {

      const session = {
        user: {
          id: 1
        }
      };
      const commentMock = {
        User: {
          id: 1
        },
        SubWebbit: {
          hadMod: jest.fn(() => false)
        },
        destroy: jest.fn()
      };

      db.Comment.findByPk = jest.fn(() => commentMock);

      await CommentService.deleteComment(session, 1);
      expect(commentMock.destroy).toHaveBeenCalled();

    });
  });

  describe('#likeComment', () => {
    it('comment does not exist', async () => {

      const session = {};
      
      db.Comment.findByPk = jest.fn(() => null);

      await expect(async () => {
        await CommentService.likeComment(session, 1);
      }).rejects.toThrow("Comment doesn't exist");
    });
    it('liked comment (no existing like)', async () => {

      const session = {
        user: {
          id: 1
        }
      };
      const commentMock = {
        User: { // commenter
          id: 2,
          commentKarma: 0,
          save: jest.fn()
        },
        save: jest.fn()
      };
      const userMock = {
        id: 1,
        hasLike: jest.fn(() => false),
        addLike: jest.fn()
      };
      
      db.Comment.findByPk = jest.fn(() => commentMock);
      db.User.findByPk = jest.fn(() => userMock);

      await CommentService.likeComment(session, 1);
      expect(userMock.hasLike).toHaveBeenCalled();
      expect(userMock.addLike).toHaveBeenCalled();
      expect(commentMock.User.save).toHaveBeenCalled();
      expect(commentMock.save).toHaveBeenCalled();
      expect(commentMock.User.commentKarma).toBe(1);
      
    });
    it('liked comment (has existing like)', async () => {

      const session = {
        user: {
          id: 1
        }
      };
      const commentMock = {
        User: { // commenter
          id: 2,
          commentKarma: 1,
          save: jest.fn()
        },
        save: jest.fn()
      };
      const userMock = {
        id: 1,
        hasLike: jest.fn(() => true),
        removeLike: jest.fn()
      };
      
      db.Comment.findByPk = jest.fn(() => commentMock);
      db.User.findByPk = jest.fn(() => userMock);

      await CommentService.likeComment(session, 1);
      expect(userMock.hasLike).toHaveBeenCalled();
      expect(userMock.removeLike).toHaveBeenCalled();
      expect(commentMock.User.save).toHaveBeenCalled();
      expect(commentMock.save).toHaveBeenCalled();
      expect(commentMock.User.commentKarma).toBe(0);

    });
  });

  describe('#dislikeComment', () => {
    it('comment does not exist', async () => {

      const session = {};
      
      db.Comment.findByPk = jest.fn(() => null);

      await expect(async () => {
        await CommentService.dislikeComment(session, 1);
      }).rejects.toThrow("Comment doesn't exist");
    });
    it('disliked comment (no existing dislike)', async () => {

      const session = {
        user: {
          id: 1
        }
      };
      const commentMock = {
        User: { // commenter
          id: 2,
          commentKarma: 0,
          save: jest.fn()
        },
        save: jest.fn()
      };
      const userMock = {
        id: 1,
        hasDislike: jest.fn(() => false),
        addDislike: jest.fn()
      };
      
      db.Comment.findByPk = jest.fn(() => commentMock);
      db.User.findByPk = jest.fn(() => userMock);

      await CommentService.dislikeComment(session, 1);
      expect(userMock.hasDislike).toHaveBeenCalled();
      expect(userMock.addDislike).toHaveBeenCalled();
      expect(commentMock.User.save).toHaveBeenCalled();
      expect(commentMock.save).toHaveBeenCalled();
      expect(commentMock.User.commentKarma).toBe(-1);
      
    });
    it('disliked comment (has existing dislike)', async () => {

      const session = {
        user: {
          id: 1
        }
      };
      const commentMock = {
        User: { // commenter
          id: 2,
          commentKarma: 0,
          save: jest.fn()
        },
        save: jest.fn()
      };
      const userMock = {
        id: 1,
        hasDislike: jest.fn(() => true),
        removeDislike: jest.fn()
      };
      
      db.Comment.findByPk = jest.fn(() => commentMock);
      db.User.findByPk = jest.fn(() => userMock);

      await CommentService.dislikeComment(session, 1);
      expect(userMock.hasDislike).toHaveBeenCalled();
      expect(userMock.removeDislike).toHaveBeenCalled();
      expect(commentMock.User.save).toHaveBeenCalled();
      expect(commentMock.save).toHaveBeenCalled();
      expect(commentMock.User.commentKarma).toBe(1);

    });
  });
});