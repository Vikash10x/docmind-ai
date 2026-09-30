const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { validateSignup, validateSignin } = require('../utils/validators');
const { sendPasswordResetEmail } = require('../services/emailService');

// Generate signed JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const validation = validateSignup(name, email, password);
    if (!validation.valid) {
      return res.status(400).json({ success: false, error: validation.error });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({ success: false, error: 'An account with this email already exists.' });
    }

    const user = await User.create({ name: name.trim(), email: email.toLowerCase().trim(), password });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('[AUTH] Signup error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to create account. Please try again.' });
  }
};

// @route   POST /api/auth/signin
// @access  Public
const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const validation = validateSignin(email, password);
    if (!validation.valid) {
      return res.status(400).json({ success: false, error: validation.error });
    }

    // Find user (explicitly include password for comparison)
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Signed in successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('[AUTH] Signin error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to sign in. Please try again.' });
  }
};

// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      createdAt: req.user.createdAt,
    },
  });
};

// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, error: 'Email is required.' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Always return success (don't reveal if email exists)
    if (!user) {
      return res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });
    }

    const rawToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${rawToken}`;

    try {
      await sendPasswordResetEmail(user.email, user.name, resetUrl);
      res.json({ success: true, message: 'Password reset email sent. Check your inbox.' });
    } catch (emailErr) {
      // Rollback token if email fails
      user.resetPasswordToken  = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      console.error('[AUTH] Email send error:', emailErr.message);
      res.status(500).json({ success: false, error: 'Failed to send email. Please try again later.' });
    }
  } catch (error) {
    console.error('[AUTH] Forgot password error:', error.message);
    res.status(500).json({ success: false, error: 'Something went wrong. Please try again.' });
  }
};

// @route   POST /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters.' });
    }

    // Hash the incoming raw token to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken:  hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    }).select('+resetPasswordToken +resetPasswordExpire');

    if (!user) {
      return res.status(400).json({ success: false, error: 'Reset link is invalid or has expired.' });
    }

    // Set new password & clear token fields
    user.password            = password;
    user.resetPasswordToken  = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const token = generateToken(user._id);
    res.json({
      success: true,
      message: 'Password reset successfully! You are now signed in.',
      token,
      user: { id: user._id, name: user.name, email: user.email, createdAt: user.createdAt },
    });
  } catch (error) {
    console.error('[AUTH] Reset password error:', error.message);
    res.status(500).json({ success: false, error: 'Something went wrong. Please try again.' });
  }
};

// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ success: false, error: 'Name must be at least 2 characters long.' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }

    user.name = name.trim();
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('[AUTH] Update profile error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to update profile.' });
  }
};

// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, error: 'Both current and new passwords are required.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, error: 'New password must be at least 6 characters long.' });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Incorrect current password.' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    console.error('[AUTH] Change password error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to change password.' });
  }
};

// @route   POST /api/auth/google
// @access  Public
const googleAuth = async (req, res) => {
  try {
    const { credential, accessToken, userInfo: passedUserInfo } = req.body;
    let payload;

    if (passedUserInfo && passedUserInfo.email) {
      payload = passedUserInfo;
    } else if (accessToken) {
      const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (userRes.ok) {
        payload = await userRes.json();
      }
    } else if (credential) {
      try {
        const { OAuth2Client } = require('google-auth-library');
        const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        const ticket = await googleClient.verifyIdToken({
          idToken: credential,
          audience: process.env.GOOGLE_CLIENT_ID || undefined,
        });
        payload = ticket.getPayload();
      } catch (verifyErr) {
        const googleVerifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
        if (googleVerifyRes.ok) {
          payload = await googleVerifyRes.json();
        }
      }
    }

    if (!payload || !payload.email) {
      return res.status(400).json({ success: false, error: 'Could not extract user details from Google token.' });
    }

    const { email, name, sub: googleId, picture } = payload;
    const normalizedEmail = email.toLowerCase().trim();

    let user = await User.findOne({ email: normalizedEmail });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        user.avatar = picture || user.avatar;
        user.authProvider = user.authProvider || 'google';
        await user.save({ validateBeforeSave: false });
      }
    } else {
      user = await User.create({
        name: name || normalizedEmail.split('@')[0],
        email: normalizedEmail,
        googleId,
        avatar: picture,
        authProvider: 'google',
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Google authentication successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('[AUTH] Google authentication error:', error.message);
    res.status(500).json({ success: false, error: 'Google login failed. Please try again.' });
  }
};

module.exports = { signup, signin, getMe, forgotPassword, resetPassword, updateProfile, changePassword, googleAuth };
