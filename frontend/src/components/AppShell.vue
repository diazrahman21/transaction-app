<template>
  <div class="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_32%),linear-gradient(180deg,_#f8fafc_0%,_#eef6ff_52%,_#ffffff_100%)] text-slate-900">
    <header class="sticky top-0 z-20 border-b border-slate-200/80 bg-white/85 shadow-sm shadow-slate-950/5 backdrop-blur">
      <div class="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div class="min-w-0">
          <p class="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600">Widya Robotics</p>
          <h1 class="text-xl font-black tracking-tight text-slate-950">Transaction Console</h1>
        </div>
        <nav class="flex items-center gap-2">
          <router-link
            to="/transactions"
            class="rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-bold text-sky-700 transition hover:border-sky-300 hover:bg-sky-100 hover:text-sky-800"
          >
            Transaksi
          </router-link>
          <button
            type="button"
            class="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 focus:outline-none focus:ring-4 focus:ring-sky-100"
            @click="emit('logout')"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>

    <main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <slot />
    </main>
  </div>
</template>

<script setup>
const emit = defineEmits(['logout']);
</script>
