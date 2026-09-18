import { create } from "zustand";

export const useConfirmStore = create((set) => ({
    isOpen: false,
    itemName: "",
    onConfirm: null,

    /**
     * Open the confirmation dialog.
     * @param {string} itemName  – human-readable label, e.g. "appointment" | "service"
     * @param {() => Promise<void>} onConfirm – async fn called when user confirms
     */
    open: (itemName, onConfirm) =>
        set({ isOpen: true, itemName, onConfirm }),

    close: () =>
        set({ isOpen: false, itemName: "", onConfirm: null }),
}));
