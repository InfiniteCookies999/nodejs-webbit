const express = require('express');
const { StaticController } = require('../controllers');

const router = express.Router();

router.use("/static/uploads/subwebbit",
  StaticController.checkSubWebbitAccess,
  express.static("static/uploads/subwebbit"));
  
router.use("/static/default_sub_picture.jpg",
  express.static("static/default_sub_picture.jpg"));
router.use("/static/default_user_picture.jpg",
  express.static("static/default_user_picture.jpg"));

module.exports = router;