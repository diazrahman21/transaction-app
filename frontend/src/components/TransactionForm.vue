<template>
  <form class="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm" @submit.prevent="handleSubmit">
    <div class="grid gap-6 md:grid-cols-2">
      <label class="space-y-2">
        <span class="text-sm font-semibold text-slate-700">Tanggal & Waktu Transaksi</span>
        <input v-model="form.transactionDatetime" type="datetime-local" class="input-field" required />
      </label>

      <label class="space-y-2">
        <span class="text-sm font-semibold text-slate-700">Jenis Produk</span>
        <select v-model="form.productType" class="input-field" required>
          <option disabled value="">Pilih jenis produk</option>
          <option v-for="option in productOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </label>

      <label class="space-y-2">
        <span class="text-sm font-semibold text-slate-700">Quantitas</span>
        <input v-model.number="form.quantity" type="number" min="1" class="input-field" required />
      </label>

      <label class="space-y-2">
        <span class="text-sm font-semibold text-slate-700">Harga Satuan</span>
        <input :value="formattedUnitPrice" type="text" class="input-field bg-slate-50" readonly />
      </label>

      <label class="space-y-2 md:col-span-2">
        <span class="text-sm font-semibold text-slate-700">Tipe Pembayaran</span>
        <select v-model="form.paymentType" class="input-field" required>
          <option disabled value="">Pilih tipe pembayaran</option>
          <option v-for="option in paymentOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </label>
    </div>

    <div class="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
      <p class="text-sm text-slate-500">
        Total harga dihitung otomatis: <span class="font-semibold text-slate-800">{{ formattedTotalPrice }}</span>
      </p>
      <div class="flex gap-3">
        <router-link
          to="/transactions"
          class="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Batal
        </router-link>
        <button
          type="submit"
          class="rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          {{ submitLabel }}
        </button>
      </div>
    </div>
  </form>
</template>

<script setup>
import { computed, reactive, watch } from 'vue';
import { getProductUnitPrice, PAYMENT_OPTIONS, PRODUCT_OPTIONS } from '../constants/transactions';
import { formatCurrency, toDateTimeLocalValue } from '../utils/format';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  submitLabel: {
    type: String,
    default: 'Simpan',
  },
});

const emit = defineEmits(['submit']);

const form = reactive({
  transactionDatetime: '',
  productType: '',
  quantity: 1,
  paymentType: '',
  unitPrice: 0,
});

watch(
  () => props.modelValue,
  (value) => {
    form.transactionDatetime = toDateTimeLocalValue(value.transactionDatetime);
    form.productType = value.productType || '';
    form.quantity = value.quantity || 1;
    form.paymentType = value.paymentType || '';
    form.unitPrice = value.unitPrice || getProductUnitPrice(value.productType);
  },
  { immediate: true, deep: true },
);

watch(
  () => form.productType,
  (productType) => {
    form.unitPrice = getProductUnitPrice(productType);
  },
);

const productOptions = PRODUCT_OPTIONS;
const paymentOptions = PAYMENT_OPTIONS;

const formattedUnitPrice = computed(() => formatCurrency(form.unitPrice));
const formattedTotalPrice = computed(() => formatCurrency(form.quantity * form.unitPrice));

function handleSubmit() {
  emit('submit', {
    transactionDatetime: form.transactionDatetime,
    productType: form.productType,
    quantity: Number(form.quantity),
    unitPrice: form.unitPrice,
    paymentType: form.paymentType,
  });
}
</script>
