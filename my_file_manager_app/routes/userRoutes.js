const express = require('express');
const userController = require('../controllers/userController');
const passport = require('passport');

const router = express.Router();

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: User registration
 *     description: Register a new user
 *     tags:
 *       - User Registration
 *     responses:
 *       '200':
 *         description: User registered successfully
 *       '400':
 *         description: Unable to register user
 */

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: User login
 *     description: Login a user
 *     tags:
 *       - User Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       '200':
 *         description: User logged in successfully
 *       '400':
 *         description: Invalid login credentials
 */


router.post('/register', userController.register);
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }));
router.get('/logout', userController.logout);

module.exports = router;