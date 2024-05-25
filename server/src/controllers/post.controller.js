const { PostService } = require('../services');
const db = require('../models');

class PostController {
  
  async getPageOfPosts(req, res, next) {
    try {

      const posts = await PostService.getPageOfPosts(req.params.pageNumber);

      res.json(posts);

    } catch (error) {
      next(error);
    }
  }

  async get(req, res, next) {
    try {

      const post = await PostService.getPost(req.params.id, {
        model: db.User, attributes: [ 'id', 'username' ]
      });

      res.json(post);

    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {

      const post = await PostService
        .createPost(req.body.subname, req.session, req.body);

      if (req.files && req.files.length > 0) {
        await PostService.addPostMedia(post, req.files);
      }

      res.json({ "status": "success" });

    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {

      await PostService.deletePost(req.session, req.params.id);

      res.json({ "status": "success" });

    } catch (error) {
      next(error);
    }
  }

  async like(req, res, next) {
    try {

      await PostService.likePost(req.session, req.params.id);

      res.json({ "status": "success" });

    } catch (error) {
      next(error);
    }
  }

  async dislike(req, res, next) {
    try {

      await PostService.dislikePost(req.session, req.params.id);

      res.json({ "status": "success" });

    } catch (error) {
      next(error);  
    }
  }
}

module.exports = new PostController();