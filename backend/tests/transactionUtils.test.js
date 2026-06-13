const {
  calculateTotalPrice,
  generateTransactionCode,
  getUnitPriceByProductType,
  toDbPaymentType,
  toDbProductType,
} = require('../src/utils/transaction');
const { validateTransactionPayload } = require('../src/utils/validation');

describe('transaction utils', () => {
  test('generates transaction code with T- prefix', () => {
    expect(generateTransactionCode()).toMatch(/^T-[A-F0-9]{12}$/);
  });

  test('returns price for product type', () => {
    expect(getUnitPriceByProductType('Oli')).toBe(20000);
    expect(getUnitPriceByProductType('Tambal Ban')).toBe(10000);
    expect(getUnitPriceByProductType('Asuransi')).toBe(15000);
  });

  test('maps display values to db values', () => {
    expect(toDbProductType('Tambal Ban')).toBe('Tambal_Ban');
    expect(toDbPaymentType('e-money')).toBe('E_money');
  });

  test('validates transaction payload', () => {
    const { errors, data } = validateTransactionPayload({
      transactionDatetime: '2026-06-12T10:00:00.000Z',
      productType: 'Oli',
      quantity: 2,
      unitPrice: 20000,
      paymentType: 'Cash',
    });

    expect(errors).toHaveLength(0);
    expect(calculateTotalPrice(data.quantity, data.unitPrice)).toBe(40000);
  });
});
