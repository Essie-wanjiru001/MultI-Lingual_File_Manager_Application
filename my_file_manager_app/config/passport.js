const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

// Define the local strategy for Passport
passport.use(new LocalStrategy(
  {
    usernameField: 'email', // Specify that we are using 'email' as the username field
    passwordField: 'password' // Specify that we are using 'password' as the password field
  },
  async (email, password, done) => {
    try {
      console.log('Attempting login with email:', email);

      // Find the user by email
      const user = await User.findByEmail(email);
      if (!user) {
        console.log('No user found with email:', email);
        return done(null, false, { message: 'Incorrect email.' });
      }

      // Validate the password
      const isValid = await User.validatePassword(user, password);
      if (!isValid) {
        console.log('Invalid password for user:', email);
        return done(null, false, { message: 'Incorrect password.' });
      }

      // Authentication successful
      return done(null, user);
    } catch (error) {
      console.error('Error in authentication:', error);
      return done(error);
    }
  }
));

// Serialize user information to store in session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user information from session
passport.deserializeUser(async (id, done) => {
  try {
    // Find the user by primary key (id)
    const user = await User.findByPk(id);
    if (!user) {
      return done(new Error('User not found'));
    }
    done(null, user);
  } catch (error) {
    console.error('Error in deserialization:', error);
    done(error);
  }
});

module.exports = passport;
