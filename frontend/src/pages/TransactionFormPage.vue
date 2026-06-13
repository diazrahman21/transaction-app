<template>
  <AppShell @logout="handleLogout">
    <section class="space-y-5 sm:space-y-6">
      <div class="rounded-3xl border border-white/80 bg-white/90 p-5 shadow-lg shadow-slate-950/5 backdrop-blur sm:p-6">
        <p class="text-xs font-black uppercase tracking-[0.28em] text-sky-700">{{ isEdit ? 'Edit Transaksi' : 'Tambah Transaksi' }}</p>
        <h2 class="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
          {{ isEdit ? 'Perbarui data transaksi' : 'Buat transaksi baru' }}
        </h2>
        <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          {{ isEdit ? 'Pastikan perubahan data transaksi sudah sesuai sebelum menyimpan.' : 'Lengkapi data transaksi operasional dengan benar sebelum menyimpan.' }}
        </p>
      </div>

      <TransactionForm
        :model-value="formValue"
        :submitting="submitting"
        :submit-label="isEdit ? 'Simpan Perubahan' : 'Simpan Transaksi'"
        @submit="handleSubmit"
      />
    </section>
  </AppShell>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppShell from '../components/AppShell.vue';
import TransactionForm from '../components/TransactionForm.vue';
import { createTransaction, fetchTransaction, updateTransaction } from '../services/transactions';
import { clearStoredToken } from '../services/auth';
import { useToast } from '../composables/useToast';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const formValue = ref({});
const submitting = ref(false);
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
  if (submitting.value) {
    return;
  }

  submitting.value = true;

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
  } finally {
    submitting.value = false;
  }
}

function handleLogout() {
  clearStoredToken();
  router.push({ name: 'login' });
}

onMounted(loadTransaction);
</script>
