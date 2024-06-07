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
afterEach(() => {
  jest.restoreAllMocks();
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
      const commentMock = {
        id: 1
      };

      jest.spyOn(db.Comment, 'create').mockResolvedValue(commentMock);
      jest.spyOn(CommentService, "getCommentForViewing").mockResolvedValue(commentMock);
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
      const commentMock = {
        id: 1
      }

      jest.spyOn(db.Comment, 'create').mockResolvedValue(commentMock);
      jest.spyOn(CommentService, "getCommentForViewing").mockResolvedValue(commentMock);
      db.Comment.findByPk = jest.fn(() => replyCommentMock);
      PostService.getPost.mockResolvedValue(postMock);

      await CommentService.createComment(session, 1, 1, "content of comment");
      expect(db.Comment.create).toHaveBeenCalled();
      expect(postMock.addComment).toHaveBeenCalled();

    });
  });

  describe('#deleteComment', () => {
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

      jest.spyOn(CommentService, 'getComment').mockResolvedValue(commentMock);
      
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

      jest.spyOn(CommentService, 'getComment').mockResolvedValue(commentMock);

      await CommentService.deleteComment(session, 1);
      expect(commentMock.destroy).toHaveBeenCalled();

    });
  });

  describe('#likeComment', () => {
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
        hasCommentLike: jest.fn(() => false),
        addCommentLike: jest.fn()
      };
      
      jest.spyOn(CommentService, 'getComment').mockResolvedValue(commentMock);
      db.User.findByPk = jest.fn(() => userMock);

      await CommentService.likeComment(session, 1);
      expect(userMock.hasCommentLike).toHaveBeenCalled();
      expect(userMock.addCommentLike).toHaveBeenCalled();
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
        hasCommentLike: jest.fn(() => true),
        removeCommentLike: jest.fn()
      };
      
      jest.spyOn(CommentService, 'getComment').mockResolvedValue(commentMock);
      db.User.findByPk = jest.fn(() => userMock);

      await CommentService.likeComment(session, 1);
      expect(userMock.hasCommentLike).toHaveBeenCalled();
      expect(userMock.removeCommentLike).toHaveBeenCalled();
      expect(commentMock.User.save).toHaveBeenCalled();
      expect(commentMock.save).toHaveBeenCalled();
      expect(commentMock.User.commentKarma).toBe(0);

    });
  });

  describe('#getComment', () => {
    it('comment does not exist', async () => {

      db.Comment.findByPk = jest.fn(() => null);

      await expect(async () => {
        await CommentService.getComment(1);
      }).rejects.toThrow("Comment doesn't exist");
    });
  });

  describe('#dislikeComment', () => {
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
        hasCommentDislike: jest.fn(() => false),
        addCommentDislike: jest.fn()
      };
      
      jest.spyOn(CommentService, 'getComment').mockResolvedValue(commentMock);
      db.User.findByPk = jest.fn(() => userMock);

      await CommentService.dislikeComment(session, 1);
      expect(userMock.hasCommentDislike).toHaveBeenCalled();
      expect(userMock.addCommentDislike).toHaveBeenCalled();
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
        hasCommentDislike: jest.fn(() => true),
        removeCommentDislike: jest.fn()
      };
      
      jest.spyOn(CommentService, 'getComment').mockResolvedValue(commentMock);
      db.User.findByPk = jest.fn(() => userMock);

      await CommentService.dislikeComment(session, 1);
      expect(userMock.hasCommentDislike).toHaveBeenCalled();
      expect(userMock.removeCommentDislike).toHaveBeenCalled();
      expect(commentMock.User.save).toHaveBeenCalled();
      expect(commentMock.save).toHaveBeenCalled();
      expect(commentMock.User.commentKarma).toBe(1);

    });
  });
});