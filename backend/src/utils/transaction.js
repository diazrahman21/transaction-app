const crypto = require('crypto');

const PRODUCT_PRICES = {
  Oli: 20000,
  'Tambal Ban': 10000,
  Asuransi: 15000,
};

const PRODUCT_TYPES = Object.keys(PRODUCT_PRICES);
const PAYMENT_TYPES = ['Gopay', 'e-money', 'Shopee', 'Cash'];

const PRODUCT_TYPE_DB_MAP = {
  Oli: 'Oli',
  'Tambal Ban': 'Tambal_Ban',
  Asuransi: 'Asuransi',
};

const PAYMENT_TYPE_DB_MAP = {
  Gopay: 'Gopay',
  'e-money': 'E_money',
  Shopee: 'Shopee',
  Cash: 'Cash',
};

const DB_PRODUCT_TYPE_MAP = Object.fromEntries(
  Object.entries(PRODUCT_TYPE_DB_MAP).map(([displayValue, dbValue]) => [dbValue, displayValue]),
);

const DB_PAYMENT_TYPE_MAP = Object.fromEntries(
  Object.entries(PAYMENT_TYPE_DB_MAP).map(([displayValue, dbValue]) => [dbValue, displayValue]),
);

function getUnitPriceByProductType(productType) {
  return PRODUCT_PRICES[productType] || null;
}

function calculateTotalPrice(quantity, unitPrice) {
  return Number(quantity) * Number(unitPrice);
}

function generateTransactionCode() {
  return `T-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
}

function isValidDateString(value) {
  return value && !Number.isNaN(new Date(value).getTime());
}

function normalizeDateRange(startDate, endDate) {
  const where = {};

  if (startDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    where.gte = start;
  }

  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    where.lte = end;
  }

  return where;
}

function toDbProductType(productType) {
  return PRODUCT_TYPE_DB_MAP[productType] || null;
}

function toDbPaymentType(paymentType) {
  return PAYMENT_TYPE_DB_MAP[paymentType] || null;
}

function toDisplayProductType(productType) {
  return DB_PRODUCT_TYPE_MAP[productType] || productType;
}

function toDisplayPaymentType(paymentType) {
  return DB_PAYMENT_TYPE_MAP[paymentType] || paymentType;
}

module.exports = {
  PRODUCT_PRICES,
  PRODUCT_TYPES,
  PAYMENT_TYPES,
  calculateTotalPrice,
  generateTransactionCode,
  getUnitPriceByProductType,
  isValidDateString,
  normalizeDateRange,
  toDbProductType,
  toDbPaymentType,
  toDisplayProductType,
  toDisplayPaymentType,
};
