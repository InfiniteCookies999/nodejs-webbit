const { HttpError } = require('../middleware');
const db = require('../models');
const PostService = require('./post.service');
const SubWebbitService = require('./subwebbit.service');

class CommentService {

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

  async deleteComment(session, commentId) {
    const comment = await db.Comment.findByPk(commentId, { include: [ db.SubWebbit, db.User ] });
    if (!comment)
      throw new HttpError("Comment doesn't exist", 400);

    const userId = session.user.id;

    // Making sure that the user has authorization to delete the comment.
    if (comment.User.id != userId &&
        !(await comment.SubWebbit.hadMod(userId)))
      throw new HttpError("Not User's comment", 401);

    await comment.destroy();
  }

  async likeComment(session, commentId) {
    const comment = await db.Comment
      .findByPk(commentId, { include: [ db.SubWebbit, db.User ] });
    if (!comment)
      throw new HttpError("Comment doesn't exist", 400);

    await SubWebbitService.checkViewAccess(session, comment.SubWebbit);

    const commenter = comment.User;
    const user = await db.User.findByPk(session.user.id);
    if (await user.hasLike(comment)) {
      // The user already liked this comment, so have to unlike the comment.
      comment.likes -= 1;
      if (user.id != commenter.id) {
        commenter.commentKarma -= 1;
      }
      user.removeLike(comment);
    } else {
      comment.likes += 1;
      if (user.id != commenter.id) {
        commenter.commentKarma += 1;
      }
      user.addLike(comment);
    }

    if (user.id != commenter.id) {
      commenter.save();
    }
    await comment.save();
    
  }

  async dislikeComment(session,  commentId) {
    
    const comment = await db.Comment
      .findByPk(commentId, { include: [ db.SubWebbit, db.User ] });
    if (!comment)
      throw new HttpError("Comment doesn't exist", 400);

    await SubWebbitService.checkViewAccess(session, comment.SubWebbit);

    const commenter = comment.User;
    const user = await db.User.findByPk(session.user.id);
    if (await user.hasDislike(comment)) {
      // The user already disliked this comment, so have to undislike the comment.
      comment.dislikes -= 1;
      if (user.id != commenter.id) {
        commenter.commentKarma += 1;
      }
      user.removeDislike(comment);
    } else {
      comment.dislikes += 1;
      if (user.id != commenter.id) {
        commenter.commentKarma -= 1;
      }
      user.addDislike(comment);
    }

    if (user.id != commenter.id) {
      commenter.save();
    }
    await comment.save();

  }
}

module.exports = new CommentService();