<template>
  <div class="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_30%),linear-gradient(180deg,_#eff6ff_0%,_#f8fafc_54%,_#ffffff_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
    <div class="grid w-full max-w-5xl items-center gap-8 lg:grid-cols-[0.95fr_1fr] lg:gap-10">
      <section class="mx-auto max-w-xl space-y-6 text-center lg:mx-0 lg:text-left">
        <div class="inline-flex items-center gap-3 rounded-full border border-sky-100 bg-white/75 px-4 py-2 shadow-sm shadow-sky-950/5">
          <span class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white">
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4.5 7.5h15v11a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
              <path d="M5 7.5V5.75A2.25 2.25 0 0 1 7.25 3.5h9.25" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              <path d="M16 14h3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
          </span>
          <p class="text-xs font-black uppercase tracking-[0.28em] text-sky-700">Transaction App</p>
        </div>

        <h1 class="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
          Login untuk mengelola transaksi operasional.
        </h1>
        <p class="text-base leading-7 text-slate-600">
          Akses dashboard transaksi internal dengan tampilan yang ringkas, aman, dan mudah digunakan.
        </p>
      </section>

      <section class="mx-auto w-full max-w-md rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-xl shadow-slate-950/10 backdrop-blur sm:p-8">
        <div class="space-y-2">
          <h2 class="text-2xl font-black text-slate-950">Masuk</h2>
          <p class="text-sm leading-6 text-slate-500">Gunakan akun yang sudah terdaftar untuk melanjutkan.</p>
        </div>

        <form class="mt-7 space-y-5" novalidate @submit.prevent="handleLogin">
          <label class="space-y-2 block">
            <span class="text-sm font-semibold text-slate-700">Username</span>
            <input
              v-model="form.username"
              type="text"
              class="input-field"
              :class="errors.username ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-100' : ''"
              placeholder="Masukkan username"
              autocomplete="username"
              @input="clearFieldError('username')"
            />
            <p v-if="errors.username" class="text-sm font-medium text-rose-600">{{ errors.username }}</p>
          </label>

          <label class="space-y-2 block">
            <span class="text-sm font-semibold text-slate-700">Password</span>
            <span class="relative block">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="input-field pr-12"
                :class="errors.password ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-100' : ''"
                placeholder="Masukkan password"
                autocomplete="current-password"
                @input="clearFieldError('password')"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-3 my-auto inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-sky-50 hover:text-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-100"
                :aria-label="showPassword ? 'Sembunyikan password' : 'Tampilkan password'"
                @click="showPassword = !showPassword"
              >
                <svg v-if="showPassword" class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M3 3l18 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                  <path d="M10.7 10.7a2 2 0 0 0 2.6 2.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                  <path d="M9.5 5.3A8.8 8.8 0 0 1 12 5c5 0 8.5 4.4 9.5 7a12.7 12.7 0 0 1-2.3 3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M6.4 6.8A12.8 12.8 0 0 0 2.5 12C3.5 14.6 7 19 12 19a8.9 8.9 0 0 0 4.1-1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <svg v-else class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M2.5 12S6 5 12 5s9.5 7 9.5 7S18 19 12 19s-9.5-7-9.5-7Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
                  <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" stroke-width="1.8" />
                </svg>
              </button>
            </span>
            <p v-if="errors.password" class="text-sm font-medium text-rose-600">{{ errors.password }}</p>
          </label>

          <p v-if="loginError" class="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            {{ loginError }}
          </p>

          <button
            type="submit"
            class="w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-sky-800 hover:shadow-sky-900/20 focus:outline-none focus:ring-4 focus:ring-sky-100 active:translate-y-0"
          >
            Login
          </button>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { login, setStoredToken } from '../services/auth';
import { useToast } from '../composables/useToast';

const router = useRouter();
const toast = useToast();

const form = reactive({
  username: '',
  password: '',
});

const showPassword = ref(false);
const loginError = ref('');
const errors = reactive({
  username: '',
  password: '',
});

function clearFieldError(field) {
  errors[field] = '';
  loginError.value = '';
}

function validateForm() {
  errors.username = form.username.trim() ? '' : 'Username wajib diisi.';
  errors.password = form.password ? '' : 'Password wajib diisi.';

  return !errors.username && !errors.password;
}

async function handleLogin() {
  loginError.value = '';

  if (!validateForm()) {
    return;
  }

  try {
    const response = await login(form);
    setStoredToken(response.data.token);
    toast.success('Login berhasil.');
    await router.push({ name: 'transactions' });
  } catch (error) {
    loginError.value = error.response?.data?.message || 'Gagal login.';
    toast.error(loginError.value);
  }
}
</script>
