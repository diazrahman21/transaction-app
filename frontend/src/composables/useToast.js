import { addToast } from '../stores/ui';

export function useToast() {
  return {
    success(message) {
      addToast(message, 'success');
    },
    error(message) {
      addToast(message, 'error');
    },
    info(message) {
      addToast(message, 'info');
    },
  };
}
