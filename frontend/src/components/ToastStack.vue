<template>
  <div class="pointer-events-none fixed right-4 top-4 z-50 flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3">
    <transition-group name="toast">
      <div
        v-for="toast in toastState.items"
        :key="toast.id"
        class="pointer-events-auto rounded-2xl border px-4 py-3 shadow-lg backdrop-blur"
        :class="toastClasses[toast.type]"
      >
        <p class="text-sm font-semibold">{{ toast.message }}</p>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { toastState } from '../stores/ui';

const toastClasses = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  error: 'border-rose-200 bg-rose-50 text-rose-900',
  info: 'border-sky-200 bg-sky-50 text-sky-900',
};
</script>
