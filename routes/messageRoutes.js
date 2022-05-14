const express = require('express');
const {
  allMessages,
  createMessage,
} = require('../controllers/messageController');

const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/:chatId').get(protect, allMessages);
router.route('/').post(protect, createMessage);

module.exports = router;
