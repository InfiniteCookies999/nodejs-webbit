const express = require('express');
const { body } = require('express-validator');
const { validateBody,
        validateLogin,
        validateFileExists,
        fileFilter } = require('../middleware');
const { SubWebbitController } = require('../controllers');
const multer = require('multer');

const upload = multer({
  dest: '/upload',
  fileFilter: fileFilter([ "image/png", "image/jpg", "image/jpeg" ])
});

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

router.post('/subwebbit',
  body('name').isLength({ min: 3, max: 40 }).isAlphanumeric(),
  body('type').isIn([ 'public', 'private', 'restricted' ]),
  body('adultRated').isBoolean(),
  validateBody,
  validateLogin,
  SubWebbitController.create
);

router.delete('/subwebbit/:name',
  validateLogin,
  SubWebbitController.delete
);

router.put('/subwebbit/:name/description',
  // TODO: Might want to support unicode
  body('description').isLength({ min: 1, max: 500 }).isAscii(),
  validateBody,
  validateLogin,
  SubWebbitController.updateDescription
);

router.put('/subwebbit/:name/banner',
  upload.single('file'),
  validateFileExists,
  validateLogin,
  SubWebbitController.updateBannerIcon
);

router.put('/subwebbit/:name/background',
  upload.single('file'),
  validateFileExists,
  validateLogin,
  SubWebbitController.updateBackgroundIcon
);

router.put('/subwebbit/:name/community_picture',
  upload.single('file'),
  validateFileExists,
  validateLogin,
  SubWebbitController.updateCommunityIcon
);

module.exports = router;