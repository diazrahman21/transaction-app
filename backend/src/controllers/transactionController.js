const prisma = require('../config/prisma');
const {
  calculateTotalPrice,
  generateTransactionCode,
  normalizeDateRange,
  toDbPaymentType,
  toDbProductType,
  toDisplayPaymentType,
  toDisplayProductType,
} = require('../utils/transaction');
const { validateTransactionPayload } = require('../utils/validation');

function mapTransaction(transaction) {
  if (!transaction) {
    return null;
  }

  return {
    id: transaction.id,
    kode: transaction.kode,
    transactionDatetime: transaction.transactionDatetime,
    productType: toDisplayProductType(transaction.productType),
    quantity: transaction.quantity,
    unitPrice: transaction.unitPrice,
    paymentType: toDisplayPaymentType(transaction.paymentType),
    createdAt: transaction.createdAt,
    updatedAt: transaction.updatedAt,
    totalPrice: calculateTotalPrice(transaction.quantity, transaction.unitPrice),
  };
}

async function listTransactions(req, res, next) {
  try {
    const { start_date: startDate, end_date: endDate } = req.query;
    const transactionDatetime = normalizeDateRange(startDate, endDate);
    const where = {};

    if (transactionDatetime.gte || transactionDatetime.lte) {
      where.transactionDatetime = transactionDatetime;
    }

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: [{ transactionDatetime: 'desc' }, { createdAt: 'desc' }],
    });

    return res.json({
      data: transactions.map(mapTransaction),
    });
  } catch (error) {
    return next(error);
  }
}

async function getTransactionById(req, res, next) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: 'ID tidak valid.' });
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaksi tidak ditemukan.' });
    }

    return res.json({
      data: mapTransaction(transaction),
    });
  } catch (error) {
    return next(error);
  }
}

async function createTransaction(req, res, next) {
  try {
    const { errors, data } = validateTransactionPayload(req.body || {});

    if (errors.length > 0) {
      return res.status(400).json({ message: errors[0], errors });
    }

    const transactionDatetime = new Date(data.transactionDatetime);
    const productType = toDbProductType(data.productType);
    const paymentType = toDbPaymentType(data.paymentType);

    if (!productType || !paymentType) {
      return res.status(400).json({ message: 'Data transaksi tidak valid.' });
    }

    let kode = '';
    let isUnique = false;
    let attempt = 0;

    while (!isUnique && attempt < 10) {
      kode = generateTransactionCode();
      const existing = await prisma.transaction.findUnique({ where: { kode } });
      isUnique = !existing;
      attempt += 1;
    }

    if (!isUnique) {
      return res.status(500).json({ message: 'Gagal membuat kode transaksi unik.' });
    }

    const transaction = await prisma.transaction.create({
      data: {
        kode,
        transactionDatetime,
        productType,
        quantity: data.quantity,
        unitPrice: data.unitPrice,
        paymentType,
      },
    });

    return res.status(201).json({
      message: 'Transaksi berhasil ditambahkan.',
      data: mapTransaction(transaction),
    });
  } catch (error) {
    return next(error);
  }
}

async function updateTransaction(req, res, next) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: 'ID tidak valid.' });
    }

    const existingTransaction = await prisma.transaction.findUnique({ where: { id } });

    if (!existingTransaction) {
      return res.status(404).json({ message: 'Transaksi tidak ditemukan.' });
    }

    const { errors, data } = validateTransactionPayload(req.body || {});

    if (errors.length > 0) {
      return res.status(400).json({ message: errors[0], errors });
    }

    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data: {
        transactionDatetime: new Date(data.transactionDatetime),
        productType: toDbProductType(data.productType),
        quantity: data.quantity,
        unitPrice: data.unitPrice,
        paymentType: toDbPaymentType(data.paymentType),
      },
    });

    return res.json({
      message: 'Transaksi berhasil diperbarui.',
      data: mapTransaction(updatedTransaction),
    });
  } catch (error) {
    return next(error);
  }
}

async function deleteTransaction(req, res, next) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: 'ID tidak valid.' });
    }

    await prisma.transaction.delete({ where: { id } });

    return res.json({
      message: 'Transaksi berhasil dihapus.',
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Transaksi tidak ditemukan.' });
    }

    return next(error);
  }
}

module.exports = {
  createTransaction,
  deleteTransaction,
  getTransactionById,
  listTransactions,
  updateTransaction,
};
