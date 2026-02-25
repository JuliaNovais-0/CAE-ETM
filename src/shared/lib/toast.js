import toast from 'react-hot-toast';

export function SuccessToast(message) {
  toast.success(message);
}

// Alias compatível com outros arquivos que importam `toastSuccess`
export function toastSuccess(message) {
  return SuccessToast(message);
}

export function toastError(message) {
  toast.error(message);
}
