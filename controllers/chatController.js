const asyncHandler = require('express-async-handler');
const Chat = require('../models/chatModel');
const User = require('../models/userModel');

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    res.status(400).json({ message: 'User id not sent with request' });
    throw new Error('Please enter all fields');
  }

  try {
    let existingChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate('users', '-password')
      .populate('latestMessage');

    existingChat = await User.populate(existingChat, {
      path: 'latestMessage.sender',
      select: 'name pic email',
    });

    console.log(existingChat);

    if (existingChat.length) {
      return res.status(200).json(existingChat[0]);
    }

    const data = {
      chatName: 'sender',
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    const newChat = await Chat.create(data);

    const fullChat = await Chat.findOne({ _id: newChat._id }).populate(
      'users',
      '-password'
    );

    return res.status(200).json(fullChat);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: 'Error occurred',
    });
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    let allChats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate('users', '-password')
      .populate('latestMessage')
      .populate('groupAdmin', '-password')
      .sort({ updatedAt: -1 });

    allChats = await User.populate(allChats, {
      path: 'latestMessage.sender',
      select: 'name pic email',
    });

    return res.status(200).json(allChats);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: 'Error occurred',
    });
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: 'Please Fill all the feilds' });
  }

  let users = JSON.parse(req.body.users);

  console.log(users);

  if (users.length < 2) {
    return res
      .status(400)
      .send('More than 2 users are required to form a group chat');
  }

  users.push(req.user._id);

  console.log(users);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users,
      isGroupChat: true,
      groupAdmin: req.user._id,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName,
      },
      {
        new: true,
      }
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    if (!updatedChat) {
      return res.status(404).json({ message: 'Chat Not Found' });
    }

    return res.json(updatedChat);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: 'Error occured' });
  }
});

const removeUserFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const updatedGroup = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  if (!updatedGroup) return res.status(404).json({ message: 'Chat Not Found' });

  return res.status(200).json(updatedGroup);
});


const addUserToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const updatedGroup = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  if (!updatedGroup) return res.status(404).json({ message: 'Chat Not Found' });

  return res.status(200).json(updatedGroup);
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  removeUserFromGroup,
  addUserToGroup
};
