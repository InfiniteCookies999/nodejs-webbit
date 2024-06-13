const express = require('express');
const { body } = require('express-validator');
const { validateBody,
        validateLogin,
        validateFileExists,
        fileFilter } = require('../middleware');
const multer = require('multer');
const { UserController } = require('../controllers');

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

const upload = multer({
  dest: '/upload',
  fileFilter: fileFilter([ "image/png", "image/jpg", "image/jpeg" ])
});

router.put('/user/gender',
  body('gender').isIn([ 'Woman', 'Man', 'Non-Binary', 'Not-Say' ]),
  validateLogin,
  validateBody,
  UserController.updateGender
);

router.put('/user/profilePicture',
  upload.single('file'),
  validateLogin,
  validateFileExists,
  UserController.updateProfilePicture
);

module.exports = router;