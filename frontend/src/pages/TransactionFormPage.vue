<template>
  <AppShell @logout="handleLogout">
    <section class="space-y-6">
      <div class="rounded-3xl border border-white/80 bg-white/80 p-6 shadow-lg backdrop-blur">
        <p class="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">{{ isEdit ? 'Edit Transaksi' : 'Tambah Transaksi' }}</p>
        <h2 class="mt-1 text-3xl font-black tracking-tight text-slate-950">
          {{ isEdit ? 'Perbarui data transaksi' : 'Buat transaksi baru' }}
        </h2>
      </div>

      <TransactionForm :model-value="formValue" :submit-label="isEdit ? 'Simpan Perubahan' : 'Simpan Transaksi'" @submit="handleSubmit" />
    </section>
  </AppShell>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppShell from '../components/AppShell.vue';
import TransactionForm from '../components/TransactionForm.vue';
import { createTransaction, fetchTransaction, updateTransaction } from '../services/transactions';
import { useToast } from '../composables/useToast';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const formValue = ref({});
const transactionId = computed(() => route.params.id);
const isEdit = computed(() => Boolean(transactionId.value));

async function loadTransaction() {
  if (!isEdit.value) {
    return;
  }

  try {
    const response = await fetchTransaction(transactionId.value);
    formValue.value = response.data.data;
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal memuat data transaksi.');
    await router.push({ name: 'transactions' });
  }
}

async function handleSubmit(payload) {
  try {
    if (isEdit.value) {
      await updateTransaction(transactionId.value, payload);
      toast.success('Transaksi berhasil diperbarui.');
    } else {
      await createTransaction(payload);
      toast.success('Transaksi berhasil ditambahkan.');
    }

    await router.push({ name: 'transactions' });
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal menyimpan transaksi.');
  }
}

function handleLogout() {
  localStorage.removeItem('token');
  router.push({ name: 'login' });
}

onMounted(loadTransaction);
</script>
