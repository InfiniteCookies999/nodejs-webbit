const { CommentService } = require('../services');

class CommentController {

  async getComment(req, res, next) {
    try {

      const comment = await CommentService
        .getCommentForViewing(req.session, req.params.id);

      res.json(comment);

    } catch (error) {
      next(error);
    }
  }

  async getPageOfComments(req, res, next) {
    try {

      const comments = await CommentService
        .getPageOfComments(req.session, req.query.postId, req.query.pageNumber);

      res.json(comments);

    } catch (error) {
      next(error);
    }
  }

  async getPageOfReplies(req, res, next) {
    try {

      const replies = await CommentService
        .getPageOfReplies(req.session,
                          req.query.commentId,
                          req.query.pageNumber,
                          req.query.useLargePages);

      res.json(replies);

    } catch (error) {
      next(error);
    }
  }

  async getNumberOfReplies(req, res, next) {
    try {

      const numberOfReplies = await CommentService
        .getNumberOfReplies(req.session, req.params.id);

      res.json({ count: numberOfReplies });

    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      await CommentService
        .createComment(req.session,
                       req.body.postId,
                       req.body.replyId,
                       req.body.content);
      
      res.json({ "status": "success" });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
    
      await CommentService.deleteComment(req.session, req.params.id);
    
      res.json({ "status": "success" });
    } catch (error) {
      next(error);
    }
  }

  async like(req, res, next) {
    try {

      await CommentService
        .likeComment(req.session, req.params.id, req.body.commentId);

      res.json({ "status": "success" });
    } catch (error) {
      next(error);
    }
  }

  async dislike(req, res, next) {
    try {
      
      await CommentService
        .dislikeComment(req.session, req.params.id, req.body.commentId);

      res.json({ "status": "success" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CommentController();