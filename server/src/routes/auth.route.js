const express = require('express');
const { body, oneOf } = require('express-validator');
const { validateBody } = require('../middleware');
const { AuthController } = require('../controllers');

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[_=+!@#$%^&*.])[a-zA-Z0-9_=+!@#$%^&*.]{8,100}$/;
const USERNAME_REGEX = /^[a-zA-Z0-9]{3,20}$/;

router.post('/auth/register',
  body('email').isEmail(),
  body('username').matches(USERNAME_REGEX),
  body('password').matches(PASSWORD_REGEX),
  validateBody,
  AuthController.register
);

// TODO: Should this be moved? It seems out of place here.
router.put('/auth/gender',
  body('gender').isIn([ 'Woman', 'Man', 'Non-Binary', 'Not-Say' ]),
  validateBody,
  AuthController.updateGender
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

router.get('/auth/session/status',
  AuthController.isLoggedIn
);

router.get('/auth/emailexists/:email',
  AuthController.doesEmailExist
);

module.exports = router;