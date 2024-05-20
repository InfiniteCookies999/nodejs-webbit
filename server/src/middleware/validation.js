const { validationResult } = require('express-validator');
const HttpError = require('./http.error');

function validateBody(req, res, next) {
  const errorResult = validationResult(req);
  if (!errorResult.isEmpty()) {
    const errorMessage = errorResult.array();
    let error = new HttpError(JSON.stringify({
      "errors": errorMessage
    }), 400);
    next(error);
  } else {
    // No error in the body of the json continue with route.
    next();
  }
}

function validateLogin(req, res, next) {
  if (!req.session.user) {
    next(new HttpError("No access", 401));
  } else {
    // The user is logged in continue to route.
    next();
  }
}

function validateFileExists(req, res, next) {
  if (!req.file) {
    next(new HttpError("Missing file", 400));
  } else {
    next();
  }
}

module.exports = {
  validateBody,
  validateLogin,
  validateFileExists
};