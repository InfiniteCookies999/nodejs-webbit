const express = require('express');
const config = require('./config/env.config');
const createApp = require('./create.app');
const db = require('./models');
const bcrypt = require('bcryptjs');

(async () => {

  const app = createApp();

  app.use(express.static("build"));
  
  try {
    db.initialize();
    await db.sequelize.authenticate();
    const shouldAlter = config.DATABASE_DEV_UPDATE || false;
    await db.sequelize.sync({ alter: shouldAlter });

    if (config.DATABASE_SHOULD_MOCK_DATA === "true") {
      await db.User.bulkCreate([
        {
          email: 'bestemail1@gmail.com',
          password: await bcrypt.hash('password', 10),
          emailVerified: true,
          username: 'bestuser1',
          gender: 'Woman',
          postKarma: 0,
          commentKarma: 0
        },
        {
          email: 'bestemail2@gmail.com',
          password: await bcrypt.hash('password', 10),
          emailVerified: true,
          username: 'bestuser2',
          gender: 'Woman',
          postKarma: 0,
          commentKarma: 0
        }
      ]);

      const bestUser1 = await db.User.findOne({ where: { email: 'bestemail1@gmail.com' } });

      await db.SubWebbit.bulkCreate([
        {
          name: "coffeesub",
          type: "public",
          adultRated: false,
          description: "sub about coffee"
        },
        {
          name: "superprivate",
          type: "private",
          adultRated: false,
          description: "this is a private subwebbit"
        },
      ]);
      
      const coffeeSub = await db.SubWebbit.findOne({ where: { name: "coffeesub" } });
      const privateSub = await db.SubWebbit.findOne({ where: { name: "superprivate" } });
      coffeeSub.addMod(bestUser1);
      
      const postData1 = Array.from({length:50}, (_, i) => ({
        title: `The title of a post (Post: ${i})`,
        body: 'This is the content of the post and what the post says and so on',
        likes: 0,
        dislikes: 0,
        UserId: bestUser1.id,
        SubWebbitId: coffeeSub.id
      }));
      const postData2 = Array.from({length:10}, (_, i) => ({
        title: `Super secret post (Post ${i})`,
        body: 'This is the content of a super secret post you definitely cannot see this unless you have access',
        likes: 0,
        dislikes: 0,
        UserId: bestUser1.id,
        SubWebbitId: privateSub.id
      }));

      await db.Post.bulkCreate(postData1);
      await db.Post.bulkCreate(postData2);
      

      const firstPost = await db.Post.findOne({
        order: [ [ 'createdAt', 'ASC' ] ]
      });
      
      const comments = Array.from({length:50}, (_, i) => ({
        PostId: firstPost.id,
        SubWebbitId: coffeeSub.id,
        UserId: bestUser1.id,
        content: `This is the content of comment #${i}`,
        likes: 0,
        dislikes: 0,
      }));

      await db.Comment.bulkCreate(comments);

    }

  } catch (error) {
    console.log(error);
    return;
  }

  const port = config.SERVER_PORT || 3000;
  app.listen(port, () => {
    console.log('started express server');
  });

})();
