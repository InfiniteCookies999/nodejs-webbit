const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { authRouter } = require('./routes');
const { errorHandler } = require('./middleware');

function createApp() {

  const app = express();

  app.use(session({
    resave: false,
    secret: "ASd#@$afsd21SD32",
    cookie: { maxAge: 30000 }, // how long in milliseconds the cookie will stay alive.
    saveUninitialized: false
  }));
  app.use(authRouter);
  app.use(cookieParser());
  app.use(errorHandler);

  return app;
}

module.exports = createApp;