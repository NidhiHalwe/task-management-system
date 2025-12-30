const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Register
router.post(
  '/register',
  [
    body('name', 'Name is required').notEmpty(),
    body('email', 'Valid email required').isEmail(),
    body('password', 'Password min 6 chars').isLength({ min: 6 })
  ],
  authController.register
);

// Login
router.post(
  '/login',
  [body('email', 'Valid email required').isEmail(), body('password', 'Password required').exists()],
  authController.login
);

// Get current user
router.get('/me', auth, authController.getMe);

module.exports = router;
