export const PRODUCT_OPTIONS = [
  { label: 'Oli', value: 'Oli', unitPrice: 20000 },
  { label: 'Tambal Ban', value: 'Tambal Ban', unitPrice: 10000 },
  { label: 'Asuransi', value: 'Asuransi', unitPrice: 15000 },
];

export const PAYMENT_OPTIONS = [
  { label: 'Gopay', value: 'Gopay' },
  { label: 'e-money', value: 'e-money' },
  { label: 'Shopee', value: 'Shopee' },
  { label: 'Cash', value: 'Cash' },
];

export function getProductUnitPrice(productType) {
  return PRODUCT_OPTIONS.find((option) => option.value === productType)?.unitPrice || 0;
}
