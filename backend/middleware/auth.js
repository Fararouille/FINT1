const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes — verify JWT
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Non autorise, token manquant' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return res.status(401).json({ message: 'Utilisateur non trouve' });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide' });
  }
};

// Manager only
const managerOnly = (req, res, next) => {
  if (req.user.role !== 'manager') {
    return res.status(403).json({ message: 'Acces reserve aux managers' });
  }
  next();
};

// Comptable only
const comptableOnly = (req, res, next) => {
  if (req.user.role !== 'comptable') {
    return res.status(403).json({ message: 'Acces reserve aux comptables' });
  }
  next();
};

module.exports = { protect, managerOnly, comptableOnly };
