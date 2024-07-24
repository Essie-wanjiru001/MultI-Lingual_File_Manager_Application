const User = require('../models/User');
const passport = require('passport');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password });
    // res.status(201).json({ message: 'User registered successfully', userId: user.id });
    res.redirect('/login');
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

exports.login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(400).json({ message: info.message });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      // return res.json({ message: 'Logged in successfully', user: { id: user.id, username: user.username } });
      res.redirect('/');
    });
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout(err => {
    if (err) {
      return next(err);
    }
    res.redirect('/login');
  });

  res.json({ message: 'Logged out successfully' });
};
