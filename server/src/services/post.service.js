const db = require('../models');
const { HttpError } = require('../middleware');
const SubWebbitService = require('./subwebbit.service');
const FileUploaderService = require('./fileuploader.service');
const { Op } = require('sequelize');

class PostService {

  getPostInclude(session) {
    const include = [ { model: db.SubWebbit } ];
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

  applyVoteData(post) {
    post.isLiked = post.usersThatLiked != null && post.usersThatLiked.length > 0;
    post.isDisliked = post.usersThatDisliked != null && post.usersThatDisliked.length > 0;
    delete post.usersThatLiked;
    delete post.usersThatDisliked;
    return post;
  }

  async getPageOfPosts(session, pageCount) {
    
    const PAGE_SIZE = 10;

    const posts = await db.Post.findAndCountAll({
      limit: PAGE_SIZE,
      offset: pageCount * PAGE_SIZE,
      raw: true,
      nest: true,
      where: {
        [Op.or]: [
          { '$SubWebbit.type$': 'public' },
          { '$SubWebbit.type$': 'restricted' }
        ]
      },
      include: this.getPostInclude(session)
    })
    posts.rows.map(post => this.applyVoteData(post));
    return posts;
  }

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
      SubWebbitId: subWebbit.id,
      likes: 0,
      dislikes: 0
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

  async getPostForViewing(session, postId) {
    const post = await this.getPost(postId, this.getPostInclude(session).concat([
      { model: db.User, attributes: [ 'id', 'username' ] }
    ]));
    return this.applyVoteData(post.get({ plain: true }));
  }

  async getPost(postId, include) {
    const post = await db.Post.findByPk(postId, { include: include });
    if (!post)
      throw new HttpError("Post doesn't exist", 404);
    return post;
  }

  async deletePost(session, postId) {
    
    const post = await this.getPost(postId);
    
    if (post.UserId != session.user.id &&
        !(await post.SubWebbit.hasMod(session.user.id)))
      throw new HttpError("Not user's post", 401);

    await post.destroy();
  }

  async likePost(session, postId) {
    const post = await this.getPost(postId, [ db.SubWebbit, db.User ]);
    
    await SubWebbitService.checkPostAccess(session, post.SubWebbit);

    const poster = post.User;
    const user = await db.User.findByPk(session.user.id);
    if (await user.hasPostLike(post)) {
      // The user already liked this post, so have to unlike the post.
      post.likes -= 1;
      if (user.id != poster.id) {
        poster.postKarma -= 1;
      }
      await user.removePostLike(post);
    } else {
      post.likes += 1;
      if (user.id != poster.id) {
        poster.postKarma += 1;
      }

      await user.addPostLike(post);
    }
    if (await user.hasPostDislike(post)) {
      poster.postKarma += 1;
      post.dislikes -= 1;
      await user.removePostDislike(post);
    }

    if (user.id != poster.id) {
      await poster.save();
    }
    await post.save();

  }

  async dislikePost(session, postId) {
    const post = await this.getPost(postId, [ db.SubWebbit, db.User ]);
    
    await SubWebbitService.checkPostAccess(session, post.SubWebbit);

    const poster = post.User;
    const user = await db.User.findByPk(session.user.id);
    if (await user.hasPostDislike(post)) {
      // The user already disliked this post, so have to undislike the post.
      post.dislikes -= 1;
      if (user.id != poster.id) {
        poster.postKarma += 1;
      }
      await user.removePostDislike(post);
    } else {
      post.dislikes += 1;
      if (user.id != poster.id) {
        poster.postKarma -= 1;
      }

      await user.addPostDislike(post);
    }
    if (await user.hasPostLike(post)) {
      poster.postKarma -= 1;
      post.likes -=1;
      await user.removePostLike(post);
    }

    if (user.id != poster.id) {
      await poster.save();
    }
    await post.save();

  }
}

module.exports = new PostService();