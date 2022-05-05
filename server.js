const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const connectDB = require('./config/db');

const app = express();

dotenv.config();

connectDB();

app.get('/', (_, res) => {
  res.send('API is running');
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`server started on ${port}`.yellow.bold);
});
