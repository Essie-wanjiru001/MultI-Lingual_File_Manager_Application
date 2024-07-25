require('dotenv').config(); // Load environmental variables
const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const flash = require('connect-flash');
const { ensureAuthenticated } = require('./middleware/auth');
const passport = require('./config/passport');
const userRoutes = require('./routes/userRoutes');
const fileController = require('./controllers/fileController');
const fileRoutes = require('./routes/fileRoutes');
const File = require('./models/file');
const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const middleware = require('i18next-http-middleware');
const { setLanguage } = require('./middleware/language');
const cookieParser = require('cookie-parser');
const thumbnailQueue = require('./queues/thumbnailQueue');
const thumbnailWorker = require('./workers/thumbnailWorker');

const app = express();

app.use(cookieParser());

i18next.use(Backend).use(middleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    backend: {
      loadPath: './locales/{{lng}}/translation.json'
    }, detection: {
      order: ['querystring', 'cookie'],
      caches: ['cookie']
    }
  });

app.use(middleware.handle(i18next));
app.use(setLanguage);

// register view engine
app.set('view engine', 'ejs');

// middleware and static files
app.use(express.static('public'));
app.use(morgan('dev'));

// Start the thumbnail worker
thumbnailQueue.process(thumbnailWorker);

// Middleware for parsing JSON requests
app.use(express.json());

// Middleware for parsing URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Middleware for session management
app.use(session({
  secret: process.env.SESSION_SECRET, 
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' } 
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
app.use('/api/files', fileRoutes); 

app.get('/change-language', (req, res) => {
  const language = req.query.language;
  res.cookie('i18next', language, { maxAge: 30 * 24 * 60 * 60 * 1000 }); // 30 days
  res.redirect('back');
});

app.get('/register', (req, res) => {
  res.render('register', { i18n: req.i18n });
});

app.get('/login', (req, res) => {
  res.render('login',{ i18n: req.i18n });
});

// ejs file routes
app.get('/', ensureAuthenticated, (req, res) => {
  res.render('index', { i18n: req.i18n });
});

// Route to render the file manager page
app.get('/files', ensureAuthenticated, async (req, res) => {
  try {
    const files = await fileController.getAllFiles(req, res); 
    res.render('filemanager', { files, i18n: req.i18n }); 
  } catch (error) {
    console.error(error); 
    res.status(500).json({ error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
