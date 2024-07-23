const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findByUsername(username);
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    const isValid = await User.validatePassword(user, password);
    if (!isValid) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const [user] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, user[0]);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;