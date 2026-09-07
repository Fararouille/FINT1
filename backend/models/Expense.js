const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Titre requis'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  amount: {
    type: Number,
    required: [true, 'Montant requis'],
    min: 0,
  },
  status: {
    type: String,
    enum: ['creee', 'validee', 'refusee', 'traitee'],
    default: 'creee',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receipts: [
    {
      filename: String,
      path: String,
    },
  ],
  comment: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Expense', expenseSchema);
