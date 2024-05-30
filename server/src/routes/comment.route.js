const express = require('express');
const { validateBody, validateLogin } = require('../middleware');
const { CommentController } = require('../controllers');
const { body, param, query } = require('express-validator');

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

router.get('/comments',
  query('postId').isInt(),
  query('pageNumber').isInt(),
  validateBody,
  CommentController.getPageOfComments
);

router.get('/comment/:id',
  param('id').isInt(),
  validateBody,
  CommentController.getComment
);

router.get('/comment/replies/page',
  query('commentId').isInt(),
  query('pageNumber').isInt(),
  query('useLargePages').optional().isBoolean(),
  validateBody,
  CommentController.getPageOfReplies
);

router.get('/comment/replyCount/:id',
  param('id').isInt(),
  validateBody,
  CommentController.getNumberOfReplies
);

router.post('/comment',
  body('postId').isInt(),
  body('content').isLength({ min: 1, max: 10000 }),
  body('replyId').optional().isInt(),
  validateBody,
  validateLogin,
  CommentController.create
);

router.delete('/comment/:id',
  param('id').isInt(),
  validateBody,
  validateLogin,
  CommentController.delete
);

router.post('/comment/like/:id',
  param('id').isInt(),
  validateBody,
  validateLogin,
  CommentController.like
);

router.post('/comment/dislike/:id',
  param('id').isInt(),
  validateBody,
  validateLogin,
  CommentController.dislike
);

module.exports = router;