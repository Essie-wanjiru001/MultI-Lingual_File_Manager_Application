// app.js
const express = require('express');
const { syncDatabase } = require('./src/models');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Multilingual File Manager Application');
});

const startServer = async () => {
  try {
    await syncDatabase();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();
