const authRouter = require('./auth.route');
const subWebbitRouter = require('./subwebbit.route');
const postRouter = require('./post.route');
const commentRouter = require('./comment.route');
const staticRouter = require('./static.route');
const UserRouter = require('./user.route');

module.exports = {
  authRouter,
  subWebbitRouter,
  postRouter,
  commentRouter,
  staticRouter,
  UserRouter
};