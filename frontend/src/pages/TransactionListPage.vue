<template>
  <AppShell @logout="handleLogout">
    <section class="space-y-5 sm:space-y-6">
      <div class="flex flex-col gap-5 rounded-3xl border border-white/80 bg-white/90 p-5 shadow-lg shadow-slate-950/5 backdrop-blur sm:p-6 lg:flex-row lg:items-end lg:justify-between">
        <div class="max-w-2xl">
          <p class="text-xs font-black uppercase tracking-[0.28em] text-sky-700">Data Transaksi</p>
          <h2 class="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">Daftar transaksi</h2>
          <p class="mt-2 text-sm leading-6 text-slate-600">
            Pantau, filter, dan kelola transaksi operasional dalam satu console yang ringkas.
          </p>
        </div>
        <router-link
          to="/transactions/create"
          class="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-sky-800 hover:shadow-sky-900/20 focus:outline-none focus:ring-4 focus:ring-sky-100 active:translate-y-0 sm:w-auto"
        >
          <span class="text-lg leading-none">+</span>
          Tambah Transaksi
        </router-link>
      </div>

      <form class="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/5 sm:p-6 lg:grid-cols-[minmax(260px,1fr)_repeat(2,minmax(0,190px))_auto] lg:items-end" @submit.prevent="loadTransactions">
        <label class="space-y-2 lg:col-span-1">
          <span class="text-sm font-semibold text-slate-700">Pencarian</span>
          <input
            v-model="searchQuery"
            type="search"
            class="input-field h-12"
            placeholder="Cari transaksi..."
            autocomplete="off"
          />
        </label>
        <label class="space-y-2">
          <span class="text-sm font-semibold text-slate-700">Dari tanggal</span>
          <input v-model="filters.startDate" type="date" class="input-field h-12" />
        </label>
        <label class="space-y-2">
          <span class="text-sm font-semibold text-slate-700">Hingga tanggal</span>
          <input v-model="filters.endDate" type="date" class="input-field h-12" />
        </label>
        <div class="grid grid-cols-2 gap-3 sm:flex">
          <button type="submit" class="h-12 rounded-2xl bg-sky-600 px-5 text-sm font-bold text-white transition hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-100">
            Terapkan
          </button>
          <button type="button" class="h-12 rounded-2xl border border-slate-300 bg-white px-5 text-sm font-bold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-sky-100" @click="resetFilters">
            Reset
          </button>
        </div>
      </form>

      <div class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm shadow-slate-950/5">
        <div class="overflow-x-auto">
          <table class="min-w-[960px] divide-y divide-slate-200 text-sm">
            <thead class="bg-slate-50 text-left text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              <tr>
                <th class="px-4 py-4">Nomor</th>
                <th class="px-4 py-4">Kode</th>
                <th class="px-4 py-4">Tanggal Transaksi</th>
                <th class="px-4 py-4">Jenis Produk</th>
                <th class="px-4 py-4 text-center">Quantity</th>
                <th class="px-4 py-4 text-right">Total Harga</th>
                <th class="px-4 py-4">Tipe Pembayaran</th>
                <th class="px-4 py-4">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-if="loading">
                <td colspan="8" class="px-4 py-12 text-center text-slate-500">Memuat data...</td>
              </tr>
              <tr v-else-if="filteredTransactions.length === 0">
                <td colspan="8" class="px-4 py-14 text-center">
                  <div class="mx-auto max-w-sm">
                    <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                      <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M6 3.75h12v16.5l-2-1.25-2 1.25-2-1.25-2 1.25-2-1.25-2 1.25V3.75Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
                        <path d="M9 8h6M9 12h6M9 16h3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                      </svg>
                    </div>
                    <p class="mt-4 font-bold text-slate-800">Tidak ada transaksi yang ditemukan.</p>
                    <p class="mt-1 text-sm text-slate-500">Coba ubah kata kunci pencarian atau rentang tanggal.</p>
                  </div>
                </td>
              </tr>
              <tr v-for="(transaction, index) in paginatedTransactions" :key="transaction.id" class="transition hover:bg-sky-50/50">
                <td class="px-4 py-4 font-semibold text-slate-700">{{ rowNumber(index) }}</td>
                <td class="px-4 py-4 font-mono text-slate-900">{{ transaction.kode }}</td>
                <td class="px-4 py-4 text-slate-700">{{ formatDateTime(transaction.transactionDatetime) }}</td>
                <td class="px-4 py-4 text-slate-700">{{ transaction.productType }}</td>
                <td class="px-4 py-4 text-center font-semibold text-slate-700">{{ transaction.quantity }}</td>
                <td class="px-4 py-4 text-right font-bold text-slate-900">{{ formatCurrency(transaction.totalPrice) }}</td>
                <td class="px-4 py-4">
                  <span class="inline-flex rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">
                    {{ transaction.paymentType }}
                  </span>
                </td>
                <td class="px-4 py-4">
                  <div class="flex flex-wrap gap-2">
                    <router-link
                      :to="`/transactions/${transaction.id}/edit`"
                      class="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700 transition hover:border-amber-300 hover:bg-amber-100"
                    >
                      <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M4 20h4.8L19.3 9.5a2.1 2.1 0 0 0 0-3L17.5 4.7a2.1 2.1 0 0 0-3 0L4 15.2V20Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
                        <path d="M13.5 5.8l4.7 4.7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                      </svg>
                      Edit
                    </router-link>
                    <button
                      type="button"
                      class="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 transition hover:border-rose-300 hover:bg-rose-100"
                      @click="handleDelete(transaction.id)"
                    >
                      <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M5 7h14M10 11v6M14 11v6M8 7l.5 12h7L16 7M9.5 7l.6-2h3.8l.6 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex flex-col gap-3 border-t border-slate-200 bg-slate-50/70 px-4 py-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <p class="font-medium">{{ paginationLabel }}</p>
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="currentPage === 1"
              @click="currentPage -= 1"
            >
              Sebelumnya
            </button>
            <button
              type="button"
              class="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="currentPage === totalPages || filteredTransactions.length === 0"
              @click="currentPage += 1"
            >
              Berikutnya
            </button>
          </div>
        </div>
      </div>
    </section>
  </AppShell>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import AppShell from '../components/AppShell.vue';
import { deleteTransaction, fetchTransactions } from '../services/transactions';
import { clearStoredToken } from '../services/auth';
import { useToast } from '../composables/useToast';
import { useConfirm } from '../composables/useConfirm';
import { formatCurrency, formatDateTime } from '../utils/format';

const router = useRouter();
const toast = useToast();
const confirm = useConfirm();

const transactions = ref([]);
const loading = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const pageSize = 10;
const filters = reactive({
  startDate: '',
  endDate: '',
});

const filteredTransactions = computed(() => {
  const keyword = searchQuery.value.trim().toLowerCase();

  if (!keyword) {
    return transactions.value;
  }

  return transactions.value.filter((transaction) => {
    return [transaction.kode, transaction.productType, transaction.paymentType]
      .some((value) => String(value || '').toLowerCase().includes(keyword));
  });
});

const totalPages = computed(() => Math.max(1, Math.ceil(filteredTransactions.value.length / pageSize)));

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * pageSize;

  return filteredTransactions.value.slice(start, start + pageSize);
});

const paginationLabel = computed(() => {
  if (filteredTransactions.value.length === 0) {
    return 'Menampilkan 0 dari 0 transaksi';
  }

  const start = (currentPage.value - 1) * pageSize + 1;
  const end = Math.min(currentPage.value * pageSize, filteredTransactions.value.length);

  return `Menampilkan ${start}-${end} dari ${filteredTransactions.value.length} transaksi`;
});

function rowNumber(index) {
  return (currentPage.value - 1) * pageSize + index + 1;
}

async function loadTransactions() {
  loading.value = true;

  try {
    const response = await fetchTransactions({
      start_date: filters.startDate || undefined,
      end_date: filters.endDate || undefined,
    });

    transactions.value = response.data.data;
    currentPage.value = 1;
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal memuat transaksi.');
  } finally {
    loading.value = false;
  }
}

async function handleDelete(id) {
  const isConfirmed = await confirm.confirm('Apakah anda yakin? Ya/Batal');

  if (!isConfirmed) {
    return;
  }

  try {
    await deleteTransaction(id);
    toast.success('Transaksi berhasil dihapus.');
    await loadTransactions();
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal menghapus transaksi.');
  }
}

function resetFilters() {
  filters.startDate = '';
  filters.endDate = '';
  searchQuery.value = '';
  currentPage.value = 1;
  loadTransactions();
}

function handleLogout() {
  clearStoredToken();
  router.push({ name: 'login' });
}

watch(searchQuery, () => {
  currentPage.value = 1;
});

watch(totalPages, (value) => {
  if (currentPage.value > value) {
    currentPage.value = value;
  }
});

onMounted(loadTransactions);
</script>
