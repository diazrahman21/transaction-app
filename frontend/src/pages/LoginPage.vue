<template>
  <div class="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(2,132,199,0.18),_transparent_28%),linear-gradient(180deg,_#e0f2fe_0%,_#f8fafc_48%,_#fff7ed_100%)] px-4 py-10 text-slate-900">
    <div class="mx-auto grid max-w-5xl items-center gap-8 lg:grid-cols-2">
      <section class="space-y-6">
        <p class="text-sm font-bold uppercase tracking-[0.35em] text-sky-700">Transaction App</p>
        <h1 class="max-w-xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
          Login untuk mengelola transaksi operasional.
        </h1>
        <p class="max-w-lg text-base leading-7 text-slate-600">
          Aplikasi ini menampilkan daftar transaksi, filter tanggal, form tambah/edit, serta proteksi route berbasis JWT.
        </p>
        <div class="rounded-3xl border border-white/70 bg-white/70 p-6 shadow-lg backdrop-blur">
          <p class="text-sm font-semibold text-slate-500">Akun default</p>
          <p class="mt-1 text-lg font-bold text-slate-900">admin / admin123</p>
        </div>
      </section>

      <section class="rounded-[2rem] border border-white/80 bg-white/80 p-8 shadow-2xl backdrop-blur">
        <h2 class="text-2xl font-black text-slate-950">Masuk ke sistem</h2>
        <form class="mt-6 space-y-5" @submit.prevent="handleLogin">
          <label class="space-y-2 block">
            <span class="text-sm font-semibold text-slate-700">Username</span>
            <input v-model="form.username" type="text" class="input-field" placeholder="Masukkan username" autocomplete="username" />
          </label>

          <label class="space-y-2 block">
            <span class="text-sm font-semibold text-slate-700">Password</span>
            <input v-model="form.password" type="password" class="input-field" placeholder="Masukkan password" autocomplete="current-password" />
          </label>

          <button
            type="submit"
            class="w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-700"
          >
            Login
          </button>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { login, setStoredToken } from '../services/auth';
import { useToast } from '../composables/useToast';

const router = useRouter();
const toast = useToast();

const form = reactive({
  username: '',
  password: '',
});

async function handleLogin() {
  try {
    const response = await login(form);
    setStoredToken(response.data.token);
    toast.success('Login berhasil.');
    await router.push({ name: 'transactions' });
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal login.');
  }
}
</script>
