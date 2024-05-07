const errorHandler = require('./error.handler');
const { validateBody,
        validateLogin,
        validateFileExists } = require('./validation');

module.exports = {
  errorHandler,
  validateBody,
  validateLogin,
  validateFileExists
};