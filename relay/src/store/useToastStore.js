import { create } from 'zustand';

export const useToastStore = create((set, get) => ({
  toasts: [],

  add: ({ type = 'default', message, duration = 3500 }) => {
    const id = `t_${Date.now()}`;
    set(state => ({
      toasts: [...state.toasts, { id, type, message }],
    }));
    setTimeout(() => get().remove(id), duration);
  },

  remove: (id) => set(state => ({
    toasts: state.toasts.filter(t => t.id !== id),
  })),

  success: (msg, dur) => get().add({ type: 'success', message: msg, duration: dur }),
  error:   (msg, dur) => get().add({ type: 'error',   message: msg, duration: dur }),
  info:    (msg, dur) => get().add({ type: 'info',    message: msg, duration: dur }),
}));