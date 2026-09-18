import { create } from "zustand";

export const useServiceModalStore = create((set) => ({
    isOpen: false,
    /** null = Add mode, object = Edit mode */
    editingService: null,
    /** callback to invoke after a successful save */
    onSuccess: null,

    /** Open in Add mode */
    openAdd: (onSuccess) =>
        set({ isOpen: true, editingService: null, onSuccess }),

    /** Open in Edit mode */
    openEdit: (service, onSuccess) =>
        set({ isOpen: true, editingService: service, onSuccess }),

    close: () =>
        set({ isOpen: false, editingService: null, onSuccess: null }),
}));
