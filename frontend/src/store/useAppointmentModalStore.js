import { create } from "zustand";

export const useAppointmentModalStore = create((set) => ({
    isOpen: false,
    /** callback to invoke after a successful booking */
    onSuccess: null,

    open: (onSuccess) =>
        set({ isOpen: true, onSuccess }),

    close: () =>
        set({ isOpen: false, onSuccess: null }),
}));
