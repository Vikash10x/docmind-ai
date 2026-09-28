const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const { signup, signin, getMe, forgotPassword, resetPassword, updateProfile, changePassword, googleAuth } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Strict rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { success: false, error: 'Too many auth attempts. Please try again in 15 minutes.' },
});

router.post('/signup',          authLimiter, signup);
router.post('/signin',          authLimiter, signin);
router.post('/google',          authLimiter, googleAuth);
router.get('/me',               protect,     getMe);
router.put('/profile',          protect,     updateProfile);
router.put('/change-password',  protect,     changePassword);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password/:token', authLimiter, resetPassword);

module.exports = router;
