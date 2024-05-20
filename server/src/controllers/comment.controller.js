const { CommentService } = require('../services');

class CommentController {
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