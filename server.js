const express = require('express');
const dotenv = require('dotenv')

const app = express();

dotenv.config();

app.get('/', (_, res) => {
  res.send('API is running');
});


const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`server started on ${port}`);
});
