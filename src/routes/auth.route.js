const express = require('express');
const { body, oneOf } = require('express-validator');
const { validateBody } = require('../middleware');
const { AuthController } = require('../controllers');

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,100}$/;
const USERNAME_REGEX = /^[a-zA-Z0-0]{3,20}$/;

router.post('/auth/register',
  body('email').isEmail(),
  body('username').matches(USERNAME_REGEX),
  body('password').matches(PASSWORD_REGEX),
  body('gender').isIn([ 'Woman', 'Man', 'Non-Binary', 'Not-Say' ]),
  validateBody,
  AuthController.register
);

router.post('/auth/login',
  oneOf([
      body('emailOrUsername').isEmail(),
      body('emailOrUsername').isLength({ min: 3, max: 20 })
  ]),
  body('password').notEmpty(),
  validateBody,
  AuthController.login
);

module.exports = router;