const express = require('express');
const dotenv = require('dotenv');
require('colors');
const connectDB = require('./config/db');

const userRoutes = require('./routes/userRoutes');

const app = express();

dotenv.config();

connectDB();

app.use(express.json());

app.get('/', (_, res) => {
  res.send('API is running');
});

app.use('/api/auth', userRoutes);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`server started on ${port}`.yellow.bold);
});
