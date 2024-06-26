const { HttpError } = require('../middleware');
const db = require('../models');
const PostService = require('./post.service');
const SubWebbitService = require('./subwebbit.service');
const { Op } = require('sequelize');

class CommentService {

  getCommentInclude(session) {
    const include = [ { model: db.User, attributes: ['id', 'username', 'profileFile'] } ];
    if (!session.user) return include;

    const userId = session.user.id;
    return include.concat([
      {
        association: "usersThatLiked",
        attributes: ['id'],
        through: {
          where: {
            UserId: userId
          }
        }
      },
      // Fetch if the user of the given session disliked the comment.
      {
        association: "usersThatDisliked",
        attributes: ['id'],
        through: {
          where: {
            UserId: userId
          }
        }
      }
    ]);
  }

  applyVoteData(comment) {
    comment.isLiked = comment.usersThatLiked != null && comment.usersThatLiked.id != null;
    comment.isDisliked = comment.usersThatDisliked != null && comment.usersThatDisliked.id != null;
    delete comment.usersThatLiked;
    delete comment.usersThatDisliked;
    return comment;
  }

  async getPageOfCommentsForPost(session, postId, pageNumber) {

    const post = await PostService.getPost(postId, db.SubWebbit);
    await SubWebbitService.checkViewAccess(session, post.SubWebbit);

    const PAGE_SIZE = 30;

    const comments = await db.Comment.findAndCountAll({
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
      include: this.getCommentInclude(session)
    });
    comments.rows.map(comment => this.applyVoteData(comment));
    return comments;
  }

  async getPageOfCommentsForUser(session, userId, pageNumber) {
    
    const PAGE_SIZE = 30;

    const comments = await db.Comment.findAndCountAll({
      limit: PAGE_SIZE,
      offset: pageNumber * PAGE_SIZE,
      raw: true,
      nest: true,
      where: {
        UserId: userId
      },
      include: this.getCommentInclude(session)
        .concat([
          {
            model: db.SubWebbit,
            where: {
              [Op.or]: [
                { type: 'public' },
                { type: 'restricted' }
              ]
            }
          }
        ])
    });
    comments.rows.map(comment => this.applyVoteData(comment));
    return comments;
  }

  async getPageOfReplies(session, commentId, pageNumber, useLargePages) {

    const comment = await this.getComment(commentId, db.SubWebbit);
    await SubWebbitService.checkViewAccess(session, comment.SubWebbit);

    const PAGE_SIZE = useLargePages ? 30 : 5;

    const comments = await db.Comment.findAndCountAll({
      limit: PAGE_SIZE,
      offset: pageNumber * PAGE_SIZE,
      raw: true,
      nest: true,
      where: { replyId: comment.id },
      include: this.getCommentInclude(session)
    });
    comments.rows.map(comment => this.applyVoteData(comment));
    return comments;
  }

  async getCommentForViewing(session, commentId) {
    const include = this.getCommentInclude(session);
    include.push({ model: db.SubWebbit });
    return this.applyVoteData(await db.Comment.findByPk(commentId, {
      raw: true,
      nest: true,
      include
    }));
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

    return this.getCommentForViewing(session, comment.id);
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
    if (await user.hasCommentDislike(comment)) {
      commenter.commentKarma += 1;
      comment.dislikes -= 1;
      await user.removeCommentDislike(comment);
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
    if (await user.hasCommentLike(comment)) {
      commenter.commentKarma -= 1;
      comment.likes -=1;
      await user.removeCommentLike(comment);
    }

    if (user.id != commenter.id) {
      await commenter.save();
    }
    await comment.save();

  }
}

module.exports = new CommentService();