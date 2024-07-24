const express = require('express');
const userController = require('../controllers/userController');
const passport = require('passport');

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }));
router.get('/logout', userController.logout);

module.exports = router;