const express = require('express');
const multer = require('multer');
const path = require('path');
const Expense = require('../models/Expense');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: function (req, file, cb) {
    const allowed = /jpeg|jpg|png|pdf/;
    const extname = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowed.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers JPG, PNG et PDF sont acceptes'));
    }
  },
});

// GET /api/expenses — own expenses (employe) or all (manager/comptable)
router.get('/', protect, async (req, res) => {
  try {
    let expenses;
    if (req.user.role === 'employe') {
      expenses = await Expense.find({ user: req.user._id })
        .populate('user', 'email role')
        .sort({ createdAt: -1 });
    } else {
      expenses = await Expense.find()
        .populate('user', 'email role')
        .sort({ createdAt: -1 });
    }
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET /api/expenses/:id — single expense
router.get('/:id', protect, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id).populate('user', 'email role');
    if (!expense) {
      return res.status(404).json({ message: 'Note de frais non trouvee' });
    }
    // Employe can only see own expenses
    if (req.user.role === 'employe' && expense.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Acces refuse' });
    }
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// POST /api/expenses — create expense
router.post('/', protect, upload.array('receipts', 5), async (req, res) => {
  try {
    const { title, description, amount } = req.body;

    if (!title || !amount) {
      return res.status(400).json({ message: 'Titre et montant requis' });
    }

    const receipts = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        receipts.push({
          filename: file.originalname,
          path: file.filename,
        });
      });
    }

    const expense = await Expense.create({
      title,
      description: description || '',
      amount: parseFloat(amount),
      user: req.user._id,
      receipts,
    });

    const populated = await expense.populate('user', 'email role');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// PUT /api/expenses/:id/validate — manager validates
router.put('/:id/validate', protect, async (req, res) => {
  try {
    if (req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Seul un manager peut valider' });
    }

    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { status: 'validee', comment: req.body.comment || '' },
      { new: true }
    ).populate('user', 'email role');

    if (!expense) {
      return res.status(404).json({ message: 'Note de frais non trouvee' });
    }

    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// PUT /api/expenses/:id/refuse — manager refuses with comment
router.put('/:id/refuse', protect, async (req, res) => {
  try {
    if (req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Seul un manager peut refuser' });
    }

    const { comment } = req.body;
    if (!comment || comment.trim() === '') {
      return res.status(400).json({ message: 'Un commentaire est requis pour refuser' });
    }

    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { status: 'refusee', comment },
      { new: true }
    ).populate('user', 'email role');

    if (!expense) {
      return res.status(404).json({ message: 'Note de frais non trouvee' });
    }

    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// PUT /api/expenses/:id/process — comptable processes
router.put('/:id/process', protect, async (req, res) => {
  try {
    if (req.user.role !== 'comptable') {
      return res.status(403).json({ message: 'Seul un comptable peut traiter' });
    }

    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { status: 'traitee' },
      { new: true }
    ).populate('user', 'email role');

    if (!expense) {
      return res.status(404).json({ message: 'Note de frais non trouvee' });
    }

    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// DELETE /api/expenses/:id — delete own expense (only if creee)
router.delete('/:id', protect, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Note de frais non trouvee' });
    }

    // Only owner can delete
    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Vous ne pouvez supprimer que vos propres notes' });
    }

    // Only if status is creee
    if (expense.status !== 'creee') {
      return res.status(400).json({ message: 'Seules les notes creees peuvent etre supprimees' });
    }

    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note de frais supprimee' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
