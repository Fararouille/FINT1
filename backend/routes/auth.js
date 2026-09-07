const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // If first login, tell frontend to show password setup
    if (user.isFirstLogin) {
      const token = generateToken(user._id);
      return res.json({
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          isFirstLogin: true,
        },
      });
    }

    const token = generateToken(user._id);
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isFirstLogin: false,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// POST /api/auth/first-login — set new password on first login
router.post('/first-login', protect, async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caracteres' });
    }

    const user = await User.findById(req.user._id).select('+password');
    user.password = newPassword;
    user.isFirstLogin = false;
    await user.save();

    res.json({ message: 'Mot de passe defini avec succes' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json({
    id: req.user._id,
    email: req.user.email,
    role: req.user.role,
    isFirstLogin: req.user.isFirstLogin,
    createdAt: req.user.createdAt,
  });
});

module.exports = router;
