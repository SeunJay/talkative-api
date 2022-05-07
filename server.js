const express = require('express');
const dotenv = require('dotenv');
require('colors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
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

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`server started on ${port}`.yellow.bold);
});
