const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

passport.use(new LocalStrategy(
  {
    usernameField: 'email', // Specify that we are using 'email' as the username field
    passwordField: 'password'
  },
  async (email, password, done) => {
    try {
      console.log('Attempting login with email:', email);
      const user = await User.findByEmail(email);
      if (!user) {
        console.log('No user found with email:', email);
        return done(null, false, { message: 'Incorrect email.' });
      }
      const isValid = await User.validatePassword(user, password);
      if (!isValid) {
        console.log('Invalid password for user:', email);
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
