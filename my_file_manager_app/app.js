require('dotenv').config(); // Load environment variables
const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const flash = require('connect-flash');
const passport = require('./config/passport');
const userRoutes = require('./routes/userRoutes');
const fileRoutes = require('./routes/fileRoutes');

const app = express();
 // register view engine
app.set('view engine', 'ejs');

// middleware and static files
app.use(express.static('public'));
app.use(morgan('dev'));

// Middleware for parsing JSON requests
app.use(express.json());

// Middleware for parsing URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Middleware for session management
app.use(session({
  secret: process.env.SESSION_SECRET, // Ensure this is set in your .env file
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' } // Use secure cookies in production
}));

// Flash middleware
app.use(flash());

// Initialize passport and session
app.use(passport.initialize());
app.use(passport.session());

// Register routes
app.use('/api/users', userRoutes);
app.use('/api/files', fileRoutes); // Add route for file operations

// ejs file routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.get('/login', (req, res) => {
  res.render('login', { messages: req.flash() });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
