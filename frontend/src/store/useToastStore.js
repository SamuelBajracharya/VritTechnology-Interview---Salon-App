import { create } from 'zustand';

export const useToastStore = create((set, get) => ({
  toasts: [],

  addToast: ({ message, type = 'success', duration = 3500 }) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));

    if (duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, duration);
    }

    return id;
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  // Helper shortcuts
  success: (message, duration) => get().addToast({ message, type: 'success', duration }),
  error: (message, duration) => get().addToast({ message, type: 'error', duration }),
  info: (message, duration) => get().addToast({ message, type: 'info', duration }),
  warning: (message, duration) => get().addToast({ message, type: 'warning', duration }),
}));

export default useToastStore;
