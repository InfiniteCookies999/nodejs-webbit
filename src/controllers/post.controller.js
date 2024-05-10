const { PostService } = require('../services');

class PostController {
  async create(req, res, next) {
    try {

      const post = await PostService
        .createPost(req.params.name, req.session, req.body);

      if (req.files.length > 0) {
        await PostService.addPostMedia(post, req.files);
      }

      res.json({ "status": "success" });

    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {

      await PostService.deletePost(req.params.name, req.params.id);

      res.json({ "status": "success" });

    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PostController();