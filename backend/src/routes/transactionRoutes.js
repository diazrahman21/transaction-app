const express = require('express');
const authenticateToken = require('../middleware/auth');
const {
  createTransaction,
  deleteTransaction,
  getTransactionById,
  listTransactions,
  updateTransaction,
} = require('../controllers/transactionController');

const router = express.Router();

router.use(authenticateToken);
router.get('/', listTransactions);
router.get('/:id', getTransactionById);
router.post('/', createTransaction);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router;
