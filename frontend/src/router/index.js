import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../pages/LoginPage.vue';
import TransactionListPage from '../pages/TransactionListPage.vue';
import TransactionFormPage from '../pages/TransactionFormPage.vue';

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
  },
  {
    path: '/',
    redirect: '/transactions',
  },
  {
    path: '/transactions',
    name: 'transactions',
    component: TransactionListPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/transactions/create',
    name: 'transaction-create',
    component: TransactionFormPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/transactions/:id/edit',
    name: 'transaction-edit',
    component: TransactionFormPage,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const token = localStorage.getItem('token');

  if (to.meta.requiresAuth && !token) {
    return { name: 'login' };
  }

  if (to.name === 'login' && token) {
    return { name: 'transactions' };
  }

  return true;
});

export default router;
