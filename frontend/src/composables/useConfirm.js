import { requestConfirm } from '../stores/ui';

export function useConfirm() {
  return {
    confirm(message) {
      return requestConfirm(message);
    },
  };
}
