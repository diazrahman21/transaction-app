const { PRODUCT_TYPES, PAYMENT_TYPES, getUnitPriceByProductType } = require('./transaction');

function validateLoginPayload(body) {
  const errors = [];
  const username = typeof body.username === 'string' ? body.username.trim() : '';
  const password = typeof body.password === 'string' ? body.password.trim() : '';

  if (!username) {
    errors.push('Username wajib diisi.');
  }

  if (!password) {
    errors.push('Password wajib diisi.');
  }

  return { errors, data: { username, password } };
}

function validateTransactionPayload(body) {
  const errors = [];
  const transactionDatetime = body.transactionDatetime || body.transaction_datetime || '';
  const productType = typeof body.productType === 'string' ? body.productType.trim() : '';
  const quantity = Number(body.quantity);
  const paymentType = typeof body.paymentType === 'string' ? body.paymentType.trim() : '';
  const unitPriceInput = body.unitPrice ?? body.unit_price;
  const expectedUnitPrice = getUnitPriceByProductType(productType);
  const unitPrice = Number(unitPriceInput ?? expectedUnitPrice);

  if (!transactionDatetime) {
    errors.push('Tanggal transaksi wajib diisi.');
  }

  if (!productType || !PRODUCT_TYPES.includes(productType)) {
    errors.push('Jenis produk hanya boleh: Oli, Tambal Ban, Asuransi.');
  }

  if (!Number.isInteger(quantity) || quantity < 1) {
    errors.push('Quantitas wajib angka dan minimal 1.');
  }

  if (!paymentType || !PAYMENT_TYPES.includes(paymentType)) {
    errors.push('Tipe pembayaran hanya boleh: Gopay, e-money, Shopee, Cash.');
  }

  if (!Number.isInteger(unitPrice) || unitPrice <= 0) {
    errors.push('Harga satuan wajib angka yang valid.');
  }

  if (expectedUnitPrice && unitPrice !== expectedUnitPrice) {
    errors.push('Harga satuan harus sesuai jenis produk.');
  }

  return {
    errors,
    data: {
      transactionDatetime,
      productType,
      quantity,
      unitPrice: expectedUnitPrice || unitPrice,
      paymentType,
    },
  };
}

module.exports = {
  validateLoginPayload,
  validateTransactionPayload,
};
