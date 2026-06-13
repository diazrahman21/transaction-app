import { reactive } from 'vue';

export const toastState = reactive({
  items: [],
});

export const confirmState = reactive({
  open: false,
  message: '',
  resolver: null,
});

export function addToast(message, type = 'success') {
  const id = Date.now() + Math.random();
  toastState.items.push({ id, message, type });

  window.setTimeout(() => {
    toastState.items = toastState.items.filter((item) => item.id !== id);
  }, 3000);
}

export function requestConfirm(message) {
  return new Promise((resolve) => {
    confirmState.open = true;
    confirmState.message = message;
    confirmState.resolver = resolve;
  });
}

export function resolveConfirm(result) {
  if (confirmState.resolver) {
    confirmState.resolver(result);
  }

  confirmState.open = false;
  confirmState.message = '';
  confirmState.resolver = null;
}
