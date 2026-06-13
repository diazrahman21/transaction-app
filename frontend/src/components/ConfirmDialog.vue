<template>
  <div v-if="confirmState.open" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
    <div class="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
      <h2 class="text-xl font-bold text-slate-900">Konfirmasi</h2>
      <p class="mt-3 text-sm text-slate-600">{{ confirmState.message }}</p>
      <div class="mt-6 flex justify-end gap-3">
        <button
          type="button"
          class="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          @click="handleCancel"
        >
          Batal
        </button>
        <button
          type="button"
          class="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
          @click="handleConfirm"
        >
          Ya
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { confirmState, resolveConfirm } from '../stores/ui';

function handleCancel() {
  resolveConfirm(false);
}

function handleConfirm() {
  resolveConfirm(true);
}
</script>
