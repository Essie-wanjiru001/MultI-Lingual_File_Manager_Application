require('dotenv').config(); // Load environment variables
const express = require('express');

const app = express();

// Middleware for parsing JSON requests
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
