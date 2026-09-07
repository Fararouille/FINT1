const express = require('express');
const User = require('../models/User');
const { protect, managerOnly } = require('../middleware/auth');

const router = express.Router();

// All routes are manager only
router.use(protect, managerOnly);

// GET /api/users — list all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// POST /api/users — create user
router.post('/', async (req, res) => {
  try {
    const { email, role, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email requis' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caracteres' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'Cet email est deja utilise' });
    }

    const user = await User.create({
      email: email.toLowerCase(),
      password,
      role: role || 'employe',
      isFirstLogin: false,
    });

    res.status(201).json({
      id: user._id,
      email: user.email,
      role: user.role,
      isFirstLogin: user.isFirstLogin,
      createdAt: user.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// PUT /api/users/:id — update user
router.put('/:id', async (req, res) => {
  try {
    const { email, role } = req.body;
    const updateData = {};
    if (email) updateData.email = email.toLowerCase();
    if (role) updateData.role = role;

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouve' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// DELETE /api/users/:id — delete user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouve' });
    }
    res.json({ message: 'Utilisateur supprime' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
