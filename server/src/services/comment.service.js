const { HttpError } = require('../middleware');
const db = require('../models');
const PostService = require('./post.service');
const SubWebbitService = require('./subwebbit.service');
const { Op } = require('sequelize');

class CommentService {

  async getPageOfComments(session, postId, pageNumber) {

    const post = await PostService.getPost(postId, db.SubWebbit);
    await SubWebbitService.checkViewAccess(session, post.SubWebbit);

    const PAGE_SIZE = 30;

    return await db.Comment.findAndCountAll({
      limit: PAGE_SIZE,
      offset: pageNumber * PAGE_SIZE,
      raw: true,
      nest: true,
      where: {
        [Op.and]: [
          { PostId: post.id },
          { replyId: null } // We do not want to load replies.
        ]
      },
      include: { model: db.User, attributes: ['id', 'username'] }
    });
  }

  async getPageOfReplies(session, commentId, pageNumber, useLargePages) {

    const comment = await this.getComment(commentId, db.SubWebbit);
    await SubWebbitService.checkViewAccess(session, comment.SubWebbit);

    const PAGE_SIZE = useLargePages ? 30 : 5;

    return await db.Comment.findAndCountAll({
      limit: PAGE_SIZE,
      offset: pageNumber * PAGE_SIZE,
      raw: true,
      nest: true,
      where: { replyId: comment.id },
      include: { model: db.User, attributes: ['id', 'username'] }
    });
  }

  async getNumberOfReplies(session, commentId) {

    const comment = await this.getComment(commentId, db.SubWebbit);
    await SubWebbitService.checkViewAccess(session, comment.SubWebbit);

    return await db.Comment.count({
      where: {
        replyId: comment.id
      }
    });
  }

  async createComment(session, postId, replyId, content) {
    
    const post = await PostService.getPost(postId, db.SubWebbit);
    await SubWebbitService.checkPostAccess(session, post.SubWebbit);
    
    const commentData = {
      content: content,
      likes: 0,
      dislikes: 0,
      SubWebbitId: post.SubWebbit.id,
      UserId: session.user.id
    };
    if (replyId) {
      // Checking to make sure that the id they provided for the comment they are
      // replying to actually exists.
      if (!(await db.Comment.findByPk(replyId)))
        throw new HttpError("Could not find comment for reply", 400);

      commentData.replyId = replyId;
    }
    const comment = await db.Comment.create(commentData);
    await post.addComment(comment);
  }

  async getCommentForViewing(session, commentId) {
    const comment = await db.Comment.findByPk(commentId, {
      raw: true,
      nest: true,
      include: [
        {
          model: db.User, attributes: ['id', 'username']
        },
        { model: db.SubWebbit }
      ]
    });

    await SubWebbitService.checkViewAccess(session, comment.SubWebbit);
    
    return comment;
  }

  async getComment(commentId, include) {
    const comment = await db.Comment.findByPk(commentId, { include: include });
    if (!comment)
      throw new HttpError("Comment doesn't exist", 404);
    return comment;
  }

  async deleteComment(session, commentId) {
    const comment = await this.getComment(commentId, [ db.SubWebbit, db.User ]);

    const userId = session.user.id;

    // Making sure that the user has authorization to delete the comment.
    if (comment.User.id != userId &&
        !(await comment.SubWebbit.hadMod(userId)))
      throw new HttpError("Not User's comment", 401);

    await comment.destroy();
  }

  async likeComment(session, commentId) {
    const comment = await this.getComment(commentId, [ db.SubWebbit, db.User ]);

    await SubWebbitService.checkViewAccess(session, comment.SubWebbit);

    const commenter = comment.User;
    const user = await db.User.findByPk(session.user.id);
    if (await user.hasCommentLike(comment)) {
      // The user already liked this comment, so have to unlike the comment.
      comment.likes -= 1;
      if (user.id != commenter.id) {
        commenter.commentKarma -= 1;
      }
      await user.removeCommentLike(comment);
    } else {
      comment.likes += 1;
      if (user.id != commenter.id) {
        commenter.commentKarma += 1;
      }
      await user.addCommentLike(comment);
    }

    if (user.id != commenter.id) {
      await commenter.save();
    }
    await comment.save();
    
  }

  async dislikeComment(session,  commentId) {
    const comment = await this.getComment(commentId, [ db.SubWebbit, db.User ]);
    
    await SubWebbitService.checkViewAccess(session, comment.SubWebbit);

    const commenter = comment.User;
    const user = await db.User.findByPk(session.user.id);
    if (await user.hasCommentDislike(comment)) {
      // The user already disliked this comment, so have to undislike the comment.
      comment.dislikes -= 1;
      if (user.id != commenter.id) {
        commenter.commentKarma += 1;
      }
      await user.removeCommentDislike(comment);
    } else {
      comment.dislikes += 1;
      if (user.id != commenter.id) {
        commenter.commentKarma -= 1;
      }
      await user.addCommentDislike(comment);
    }

    if (user.id != commenter.id) {
      await commenter.save();
    }
    await comment.save();

  }
}

module.exports = new CommentService();