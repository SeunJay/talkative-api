const express = require('express');
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  removeUserFromGroup,
  addUserToGroup,
} = require('../controllers/chatController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/').post(protect, accessChat).get(protect, fetchChats);
router.route('/group').post(protect, createGroupChat);
router.route('/group/rename').patch(protect, renameGroup);
router.route('/group/remove-user').patch(protect, removeUserFromGroup);
router.route('/group/add-user').patch(protect, addUserToGroup);

module.exports = router;
