<template>
  <AppShell @logout="handleLogout">
    <section class="space-y-6">
      <div class="flex flex-col gap-4 rounded-3xl border border-white/80 bg-white/80 p-6 shadow-lg backdrop-blur lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Data Transaksi</p>
          <h2 class="mt-1 text-3xl font-black tracking-tight text-slate-950">Daftar transaksi</h2>
          <p class="mt-2 text-sm text-slate-600">Filter berdasarkan tanggal dan kelola data transaksi secara cepat.</p>
        </div>
        <router-link
          to="/transactions/create"
          class="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-700"
        >
          Tambah Transaksi
        </router-link>
      </div>

      <form class="grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-[repeat(2,minmax(0,220px))_auto] lg:items-end" @submit.prevent="loadTransactions">
        <label class="space-y-2">
          <span class="text-sm font-semibold text-slate-700">Dari tanggal</span>
          <input v-model="filters.startDate" type="date" class="input-field" />
        </label>
        <label class="space-y-2">
          <span class="text-sm font-semibold text-slate-700">Hingga tanggal</span>
          <input v-model="filters.endDate" type="date" class="input-field" />
        </label>
        <div class="flex gap-3">
          <button type="submit" class="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700">Terapkan</button>
          <button type="button" class="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100" @click="resetFilters">
            Reset
          </button>
        </div>
      </form>

      <div class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200 text-sm">
            <thead class="bg-slate-50 text-left text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              <tr>
                <th class="px-4 py-4">Nomor</th>
                <th class="px-4 py-4">Kode</th>
                <th class="px-4 py-4">Tanggal Transaksi</th>
                <th class="px-4 py-4">Jenis Produk</th>
                <th class="px-4 py-4">Quantitas</th>
                <th class="px-4 py-4">Total Harga</th>
                <th class="px-4 py-4">Tipe Pembayaran</th>
                <th class="px-4 py-4">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-if="loading">
                <td colspan="8" class="px-4 py-8 text-center text-slate-500">Memuat data...</td>
              </tr>
              <tr v-else-if="transactions.length === 0">
                <td colspan="8" class="px-4 py-8 text-center text-slate-500">Belum ada transaksi.</td>
              </tr>
              <tr v-for="(transaction, index) in transactions" :key="transaction.id" class="hover:bg-slate-50/80">
                <td class="px-4 py-4 font-semibold text-slate-700">{{ index + 1 }}</td>
                <td class="px-4 py-4 font-mono text-slate-900">{{ transaction.kode }}</td>
                <td class="px-4 py-4 text-slate-700">{{ formatDateTime(transaction.transactionDatetime) }}</td>
                <td class="px-4 py-4 text-slate-700">{{ transaction.productType }}</td>
                <td class="px-4 py-4 text-slate-700">{{ transaction.quantity }}</td>
                <td class="px-4 py-4 font-semibold text-slate-900">{{ formatCurrency(transaction.totalPrice) }}</td>
                <td class="px-4 py-4 text-slate-700">{{ transaction.paymentType }}</td>
                <td class="px-4 py-4">
                  <div class="flex flex-wrap gap-2">
                    <router-link
                      :to="`/transactions/${transaction.id}/edit`"
                      class="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700 transition hover:bg-amber-100"
                    >
                      Edit
                    </router-link>
                    <button
                      type="button"
                      class="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-100"
                      @click="handleDelete(transaction.id)"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </AppShell>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
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
const filters = reactive({
  startDate: '',
  endDate: '',
});

async function loadTransactions() {
  loading.value = true;

  try {
    const response = await fetchTransactions({
      start_date: filters.startDate || undefined,
      end_date: filters.endDate || undefined,
    });

    transactions.value = response.data.data;
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
  loadTransactions();
}

function handleLogout() {
  clearStoredToken();
  router.push({ name: 'login' });
}

onMounted(loadTransactions);
</script>
