const express = require('express');
const dotenv = require('dotenv');
require('colors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require('./middlewares/errrorMiddleware');

const app = express();

dotenv.config();

connectDB();

app.use(express.json());

app.get('/', (_, res) => {
  res.send('API is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 4000;

const server = app.listen(port, () => {
  console.log(`server started on ${port}`.yellow.bold);
});

const io = require('socket.io')(server, {
  pingTimeOut: 60000,
  cors: 'http://localhost:3000',
});

io.on('connection', (socket) => {
  console.log('connected to socket.io...');

  socket.on('setup', (userData) => {
    socket.join(userData._id);
    socket.emit('connected');
  });

  socket.on('join-chat', (roomId) => {
    console.log('user joined room ', roomId);
  });

  socket.on('typing', (room) => socket.in(room).emit('typing'));
  socket.on('stop-typing', (room) => socket.in(room).emit('stop-typing'));

  socket.on('new-message', (newMessageReceived) => {
    const chat = newMessageReceived.chat;

    if (!chat.users) return console.log('no chat users');

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;

      socket.in(user._id).emit('message-received', newMessageReceived);
    });
  });
});
