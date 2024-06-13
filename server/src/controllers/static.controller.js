const { SubWebbitService, PostService } = require('../services');
const { HttpError } = require('../middleware');
const db = require('../models');

class StaticController {
  async checkSubWebbitAccess(req, res, next) {
    try {

      const subId = parseInt(req.originalUrl.split('/').pop().split('-')[0]);
      const subWebbit = await SubWebbitService.getSubWebbitById(subId);
      if (!subWebbit)
        throw new HttpError("SubWebbit doesn't exist", 404);
      
      await SubWebbitService.checkViewAccess(req.session, subWebbit);

      // Continue to serving the file.
      next();
    } catch (error) {
      next(error);
    }
  }

  async checkPostAccess(req, res, next) {

    try {

      const postId = parseInt(req.originalUrl.split('/').pop().split('-')[0]);
      const post = await PostService.getPost(postId, {
        model: db.SubWebbit
      });
      if (!post)
        throw new HttpError("Post doesn't exist", 404);

      await SubWebbitService.checkViewAccess(req.session, post.SubWebbit);

      // Continue to serving the file.
      next();

    } catch (error) {
      next(error);
    }
  }
}

module.exports = new StaticController();