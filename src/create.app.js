const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { authRouter,
        subWebbitRouter,
        postRouter,
        commentRouter } = require('./routes');
const { errorHandler } = require('./middleware');

function createApp() {

  const app = express();

  app.use(session({
    resave: false,
    secret: "ASd#@$afsd21SD32",
    cookie: { maxAge: 86400000 }, // length of one day.
    saveUninitialized: false
  }));
  
  app.use(authRouter);
  app.use(subWebbitRouter);
  app.use(postRouter);
  app.use(commentRouter);

  app.use(cookieParser());
  app.use(errorHandler);

  return app;
}

module.exports = createApp;