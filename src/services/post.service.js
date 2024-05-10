const db = require('../models');
const { HttpError } = require('../middleware');
const SubWebbitService = require('./subwebbit.service');
const FileUploaderService = require('./fileuploader.service');

class PostService {
  async createPost(subName, session, dto) {
    const subWebbit = await SubWebbitService.getSubWebbitByName(subName);
    if (!subWebbit)
      throw new HttpError("SubWebbit doesn't exist", 404);

    if (subWebbit.type != 'public') {
      if (!(await subWebbit.hasAuthorizedUser(session.user.id)))
        throw new HttpError("User not allowed to post", 401);
    }

    return await db.Post.create({
      title: dto.title,
      body: dto.body,
      UserId: session.user.id,
      SubWebbitId: subWebbit.id
    });
  }

  async addPostMedia(post, files) {
    const destDir = 'uploads/posts/media';
    // There is media files to be included in the post.
    const uploadedFiles = files
      .map((f) => FileUploaderService.moveFileAndGenRandomName(f, destDir));

    for (const file of uploadedFiles) {
      const postMedia = await db.PostMedia.create({
        file: file
      });
      await post.addPostMedia(postMedia);
    }
  }

  async deletePost(subName, session, postId) {
    const subWebbit = await SubWebbitService.getSubWebbitByName(subName);
    if (!subWebbit)
      throw new HttpError("SubWebbit doesn't exist", 404);

    const post = await db.Post.findByPk(postId);
    if (!post)
      throw new HttpError("Post doesn't exist", 404);

    if (post.UserId != session.user.id &&
        !(await subWebbit.hasMod(session.user.id)))
      throw new HttpError("Not user's post", 401);

    await post.destroy();
  }
}

module.exports = new PostService();