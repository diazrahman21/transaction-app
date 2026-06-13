import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
});

export function setupApiInterceptors(router) {
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        if (router.currentRoute.value.meta.requiresAuth) {
          router.push({ name: 'login' });
        }
      }

      return Promise.reject(error);
    },
  );
}

export default api;
