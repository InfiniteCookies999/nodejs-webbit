const express = require('express');
const config = require('./config/env.config');
const createApp = require('./create.app');
const db = require('./models');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

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

      const firstComment = await db.Comment.findOne({
        order: [ [ 'createdAt', 'ASC' ] ]
      });
      

      const repliesToFirstComment = Array.from({length: 100}, (_, i) => ({
        PostId: firstPost.id,
        SubWebbitId: coffeeSub.id,
        UserId: bestUser1.id,
        content: `This is a reply to the first comment in the comments (${i})`,
        likes: 0,
        dislikes: 0,
        replyId: firstComment.id
      }));

      await db.Comment.bulkCreate(repliesToFirstComment);

      const someReplies = await db.Comment.findAll({
        order: [ [ 'createdAt', 'ASC' ] ],
        limit: 5,
        where: { replyId: firstComment.id }
      });
      
      let reply = someReplies[2];

      const contents = [
        "Mauris sed lacus sit amet tortor tempor gravida in quis quam. Etiam eu lectus rutrum, sollicitudin purus eu, consequat dolor. Nullam vehicula consequat augue, sed blandit neque vulputate vitae. Ut consequat nibh et nisl efficitur congue. Donec eget lacus in odio congue faucibus a sed urna. Aenean rhoncus, justo ac tempor faucibus, elit enim fermentum quam, et scelerisque leo orci vulputate velit. Vestibulum ac scelerisque ex, sed aliquam massa. Ut vel vulputate magna. ",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras eu orci in libero aliquet facilisis vel elementum quam. Aliquam semper pretium sapien, non blandit massa lacinia nec. Nullam dictum lobortis felis sit amet malesuada. Donec id nulla eget arcu ultrices dictum. Donec euismod dui id magna condimentum, placerat aliquam tortor pharetra. Donec tempus euismod ultrices. Morbi et turpis velit. In purus justo, volutpat in tristique sit amet, elementum sit amet tellus. Duis non interdum elit, at tempus diam. Curabitur commodo neque in molestie lacinia. Etiam vel justo urna. Sed ornare massa congue justo convallis, vel aliquet magna elementum. Cras convallis orci quis cursus fringilla. Cras et neque quis ligula congue imperdiet. Morbi ultricies elit in commodo pharetra. Vestibulum euismod arcu neque, et placerat ante vestibulum sit amet.",
        "Cras neque mauris, blandit a tellus vel, tristique rhoncus risus. Donec dapibus est vel turpis consequat pulvinar. Morbi eget sapien laoreet, bibendum nisi dignissim, porttitor ligula. Etiam volutpat condimentum cursus. Pellentesque et sapien ac justo molestie fringilla accumsan a lacus. Cras et mauris ut tellus feugiat varius et et nisi. Curabitur euismod leo laoreet eros efficitur viverra. Donec dictum dictum arcu at laoreet. Sed vel auctor ante. Quisque bibendum libero quis libero laoreet, et cursus lacus suscipit. Sed et enim eu libero dapibus fermentum quis et est. Vestibulum sit amet ex nulla. Duis euismod turpis urna, non congue leo viverra non. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Ut vel tempus massa.",
        "Suspendisse porttitor cursus velit, sit amet venenatis urna accumsan id. Sed a ultrices purus. Pellentesque vel fringilla ipsum. Nam a dolor eu quam accumsan tincidunt. Praesent eget nisi dui. Sed massa sem, ullamcorper eget purus vel, condimentum commodo sem. Nunc pharetra non dui non tempus. Fusce purus sem, imperdiet at metus vel, euismod euismod arcu.",
        "Maecenas convallis rhoncus erat at viverra. Integer luctus a lorem eu scelerisque. Fusce commodo odio nec turpis semper tincidunt. Donec dui augue, faucibus et dui id, condimentum bibendum mi. Suspendisse potenti. Aliquam facilisis condimentum ligula, vehicula bibendum ipsum tincidunt sagittis. Nullam rhoncus turpis et leo finibus ultrices. Nunc nec purus magna. Sed semper rutrum justo sagittis maximus. Duis dignissim justo tellus, in auctor velit dapibus vitae. Integer elit neque, laoreet nec nisl at, laoreet hendrerit erat. Duis lacus nisl, commodo non sapien a, ultrices semper neque. In rhoncus, metus vitae viverra dapibus, arcu diam volutpat lectus, ac malesuada ligula neque id tellus. Lorem ipsum dolor sit amet, consectetur adipiscing elit." 
      ]

      // Creating nested reply chain.
      for (let i = 0; i < 20; i++) {
        await db.Comment.create({
          PostId: firstPost.id,
          SubWebbitId: coffeeSub.id,
          UserId: bestUser1.id,
          content: contents[i % contents.length],
          likes: 0,
          dislikes: 0,
          replyId: reply.id
        });
        reply = await db.Comment.findOne({
          where: { replyId: reply.id }
        });
      }
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
