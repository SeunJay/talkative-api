const express = require('express');

const router = express.Router();

const { register, login } = require('../controllers/authController');
const { allUsers } = require('../controllers/userController');

router.route('/register').post(register).get(allUsers);
router.route('/login').post(login);

module.exports = router;
