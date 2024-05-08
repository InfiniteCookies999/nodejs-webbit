const { validationResult } = require('express-validator');

function validateBody(req, res, next) {
  const errorResult = validationResult(req);
  if (!errorResult.isEmpty()) {
    const errorMessage = errorResult.array();
    let error = new Error(JSON.stringify({
      "errors": errorMessage
    }));
    error.statusCode = 400;
    next(error);
  } else {
    // No error in the body of the json continue with route.
    next();
  }
}

function validateLogin(req, res, next) {
  if (!req.session.user) {
    let error = new Error("No access");
    error.statusCode = 401;
    next(error);
  } else {
    // The user is logged in continue to route.
    next();
  }
}

function validateFileExists(req, res, next) {
  if (!req.file) {
    let error = new Error("Missing file");
    error.statusCode = 400;
    next(error);
  } else {
    next();
  }
}

module.exports = {
  validateBody,
  validateLogin,
  validateFileExists
};