import api from './api';

export function fetchTransactions(params) {
  return api.get('/transactions', { params });
}

export function fetchTransaction(id) {
  return api.get(`/transactions/${id}`);
}

export function createTransaction(payload) {
  return api.post('/transactions', payload);
}

export function updateTransaction(id, payload) {
  return api.put(`/transactions/${id}`, payload);
}

export function deleteTransaction(id) {
  return api.delete(`/transactions/${id}`);
}
