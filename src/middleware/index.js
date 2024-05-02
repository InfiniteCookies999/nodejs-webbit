const errorHandler = require('./error.handler');
const { validateBody, validateLogin } = require('./validation');

module.exports = {
  errorHandler,
  validateBody,
  validateLogin
};