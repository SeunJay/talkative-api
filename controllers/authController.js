const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const { generateToken } = require('../utils/generateToken');

const register = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ message: 'Please enter all fields' });
    throw new Error('Please enter all fields');
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(400).json({ message: 'User already exists' });
    throw new Error('User already exists');
  }

  const newUser = await User.create({
    name,
    email,
    password,
    pic,
  });

  return res.status(201).json({
    id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    pic: newUser.pic,
    token: generateToken(newUser._id),
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Please enter all fields' });
    throw new Error('Please enter all fields');
  }

  const existingUser = await User.findOne({ email });

  // const match = existingUser.matchPassword(password);

  // console.log(match);

  if (!existingUser || !await existingUser.matchPassword(password)) {
    res.status(400).json({ message: 'Invalid credentials' });
    throw new Error('User already exists');
  }

  return res.status(200).json({
    name: existingUser.name,
    email: existingUser.email,
    pic: existingUser.pic,
    token: generateToken(existingUser._id),
  });
});

module.exports = { register, login };
