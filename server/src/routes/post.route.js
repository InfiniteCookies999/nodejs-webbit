const express = require('express');
const { validateBody,
        validateLogin,
        fileFilter } = require('../middleware');
const { PostController } = require('../controllers');
const { body, param } = require('express-validator');
const multer = require('multer');

const upload = multer({
  dest: '/upload',
  fileFilter: fileFilter([
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/gif",
    "video/mp4",
    "video/quicktime"
  ])
});

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/posts/:pageNumber',
  param('pageNumber').isInt(),
  validateBody,
  PostController.getPageOfPosts
);

router.post('/post',
  upload.array('media', 4),
  body('subname').notEmpty(),
  body('title').isLength({ min: 1, max: 300 }),
  body('body').isLength({ min: 1, max: 40000 }),
  validateBody,
  validateLogin,
  PostController.create
);

router.delete('/post/:id',
  param('id').isInt(),
  validateBody,
  validateLogin,
  PostController.delete
);

router.post('/post/like/:id',
  param('id').isInt(),
  validateBody,
  validateLogin,
  PostController.like
);

router.post('/post/dislike/:id',
  param('id').isInt(),
  validateBody,
  validateLogin,
  PostController.dislike
);

module.exports = router;