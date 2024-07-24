require('dotenv').config(); // Load environment variables
const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const flash = require('connect-flash');
const { ensureAuthenticated } = require('./middleware/auth');
const passport = require('./config/passport');
const userRoutes = require('./routes/userRoutes');
const fileRoutes = require('./routes/fileRoutes');
const File = require('./models/file');
// const i18next = require('./i18nConfig');
// const i18nextFsBackend = require('i18next-fs-backend');
// const i18nextHttpMiddleware = require('i18next-http-middleware');
// const path = require('path');
// const setLanguage = require('./middleware/languageMiddleware');

const app = express();


// i18next middleware
// app.use(i18nextHttpMiddleware.handle(i18next));

// language middleware
// app.use(setLanguage);

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

app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.messages = req.flash();
  next();
});

// Register routes
app.use('/api/users', userRoutes);
app.use('/api/files', fileRoutes); // Add route for file operations


app.get('/register', (req, res) => {
  res.render('register');
});

app.get('/login', (req, res) => {
  res.render('login', { messages: req.flash() });
});

// ejs file routes
app.get('/', ensureAuthenticated, (req, res) => {
  res.render('index');
});

// protected route
app.get('/files', ensureAuthenticated, async (req, res) => {
  try {
    const files = await File.findAll(); // Fetch all files from the database
    res.render('filemanager', { files });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: error.message });
  }
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
