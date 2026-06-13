<template>
  <form class="space-y-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/5 sm:p-6" novalidate @submit.prevent="handleSubmit">
    <div class="border-b border-slate-200 pb-5">
      <h3 class="text-lg font-black tracking-tight text-slate-950">Detail Transaksi</h3>
      <p class="mt-1 text-sm leading-6 text-slate-500">Masukkan informasi produk, jumlah, dan metode pembayaran.</p>
    </div>

    <div class="grid gap-5 md:grid-cols-2">
      <label class="space-y-2">
        <span class="text-sm font-semibold text-slate-700">Tanggal & Waktu Transaksi</span>
        <input
          v-model="form.transactionDatetime"
          type="datetime-local"
          class="input-field h-12 hover:border-slate-400"
          :class="errors.transactionDatetime ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-100' : ''"
          @input="clearError('transactionDatetime')"
        />
        <p v-if="errors.transactionDatetime" class="text-sm font-medium text-rose-600">{{ errors.transactionDatetime }}</p>
      </label>

      <label class="space-y-2">
        <span class="text-sm font-semibold text-slate-700">Jenis Produk</span>
        <select
          v-model="form.productType"
          class="input-field h-12 hover:border-slate-400"
          :class="errors.productType ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-100' : ''"
          @change="clearError('productType')"
        >
          <option disabled value="">Pilih jenis produk</option>
          <option v-for="option in productOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
        <p v-if="errors.productType" class="text-sm font-medium text-rose-600">{{ errors.productType }}</p>
      </label>

      <label class="space-y-2">
        <span class="text-sm font-semibold text-slate-700">Kuantitas</span>
        <input
          v-model.number="form.quantity"
          type="number"
          min="1"
          class="input-field h-12 hover:border-slate-400"
          :class="errors.quantity ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-100' : ''"
          @input="clearError('quantity')"
          @blur="normalizeQuantity"
        />
        <p v-if="errors.quantity" class="text-sm font-medium text-rose-600">{{ errors.quantity }}</p>
      </label>

      <label class="space-y-2">
        <span class="text-sm font-semibold text-slate-700">Harga Satuan</span>
        <input
          :value="formattedUnitPrice"
          type="text"
          class="input-field h-12 cursor-not-allowed border-slate-200 bg-slate-100 text-slate-600"
          readonly
        />
        <p class="text-xs font-medium text-slate-500">Harga otomatis berdasarkan jenis produk.</p>
      </label>

      <label class="space-y-2 md:col-span-2">
        <span class="text-sm font-semibold text-slate-700">Tipe Pembayaran</span>
        <select
          v-model="form.paymentType"
          class="input-field h-12 hover:border-slate-400"
          :class="errors.paymentType ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-100' : ''"
          @change="clearError('paymentType')"
        >
          <option disabled value="">Pilih tipe pembayaran</option>
          <option v-for="option in paymentOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
        <p v-if="errors.paymentType" class="text-sm font-medium text-rose-600">{{ errors.paymentType }}</p>
      </label>
    </div>

    <div class="rounded-3xl border border-sky-100 bg-sky-50/70 p-5">
      <p class="text-sm font-bold uppercase tracking-[0.2em] text-sky-700">Total Harga</p>
      <p class="mt-2 text-2xl font-black tracking-tight text-slate-950">{{ formattedTotalPrice }}</p>
      <p class="mt-1 text-sm text-slate-500">Dihitung otomatis dari harga satuan x kuantitas.</p>
    </div>

    <div class="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-end">
      <div class="grid gap-3 sm:flex">
        <button
          type="button"
          class="h-12 rounded-2xl border border-slate-300 bg-white px-5 text-sm font-bold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-sky-100 sm:min-w-28"
          :disabled="submitting"
          @click="handleCancel"
        >
          Batal
        </button>
        <button
          type="submit"
          class="h-12 rounded-2xl bg-slate-900 px-5 text-sm font-bold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-sky-800 hover:shadow-sky-900/20 focus:outline-none focus:ring-4 focus:ring-sky-100 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 sm:min-w-44"
          :disabled="submitting"
        >
          {{ submitting ? 'Menyimpan...' : submitLabel }}
        </button>
      </div>
    </div>
  </form>
</template>

<script setup>
import { computed, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import { getProductUnitPrice, PAYMENT_OPTIONS, PRODUCT_OPTIONS } from '../constants/transactions';
import { formatCurrency, toDateTimeLocalValue } from '../utils/format';
import { useConfirm } from '../composables/useConfirm';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  submitLabel: {
    type: String,
    default: 'Simpan',
  },
  submitting: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['submit']);
const router = useRouter();
const confirm = useConfirm();

const form = reactive({
  transactionDatetime: '',
  productType: '',
  quantity: 1,
  paymentType: '',
  unitPrice: 0,
});

const initialForm = reactive({
  transactionDatetime: '',
  productType: '',
  quantity: 1,
  paymentType: '',
  unitPrice: 0,
});

const errors = reactive({
  transactionDatetime: '',
  productType: '',
  quantity: '',
  paymentType: '',
});

watch(
  () => props.modelValue,
  (value) => {
    form.transactionDatetime = toDateTimeLocalValue(value.transactionDatetime) || getCurrentDateTimeLocalValue();
    form.productType = value.productType || '';
    form.quantity = value.quantity || 1;
    form.paymentType = value.paymentType || '';
    form.unitPrice = value.unitPrice || getProductUnitPrice(value.productType);
    syncInitialForm();
    clearAllErrors();
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

const isDirty = computed(() => {
  return form.transactionDatetime !== initialForm.transactionDatetime
    || form.productType !== initialForm.productType
    || Number(form.quantity) !== Number(initialForm.quantity)
    || form.paymentType !== initialForm.paymentType;
});

function getCurrentDateTimeLocalValue() {
  const date = new Date();
  const offset = date.getTimezoneOffset() * 60000;

  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function syncInitialForm() {
  initialForm.transactionDatetime = form.transactionDatetime;
  initialForm.productType = form.productType;
  initialForm.quantity = form.quantity;
  initialForm.paymentType = form.paymentType;
  initialForm.unitPrice = form.unitPrice;
}

function clearError(field) {
  errors[field] = '';
}

function clearAllErrors() {
  errors.transactionDatetime = '';
  errors.productType = '';
  errors.quantity = '';
  errors.paymentType = '';
}

function normalizeQuantity() {
  if (form.quantity !== '' && Number(form.quantity) < 1) {
    form.quantity = 1;
  }
}

function validateForm() {
  errors.transactionDatetime = form.transactionDatetime ? '' : 'Tanggal transaksi wajib diisi.';
  errors.productType = form.productType ? '' : 'Jenis produk wajib dipilih.';
  errors.quantity = Number(form.quantity) >= 1 ? '' : 'Kuantitas minimal 1.';
  errors.paymentType = form.paymentType ? '' : 'Tipe pembayaran wajib dipilih.';

  return !errors.transactionDatetime && !errors.productType && !errors.quantity && !errors.paymentType;
}

async function handleCancel() {
  if (isDirty.value) {
    const isConfirmed = await confirm.confirm('Data yang sudah diisi akan hilang. Yakin ingin membatalkan?');

    if (!isConfirmed) {
      return;
    }
  }

  router.push({ name: 'transactions' });
}

function handleSubmit() {
  if (props.submitting || !validateForm()) {
    return;
  }

  emit('submit', {
    transactionDatetime: form.transactionDatetime,
    productType: form.productType,
    quantity: Number(form.quantity),
    unitPrice: form.unitPrice,
    paymentType: form.paymentType,
  });
}
</script>
