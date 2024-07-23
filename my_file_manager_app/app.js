require('dotenv').config(); // Load environment variables
const express = require('express');
const session = require('express-session');
const passport = require('./config/passport');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware for parsing JSON requests
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Server is running!');
});
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/users', userRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;