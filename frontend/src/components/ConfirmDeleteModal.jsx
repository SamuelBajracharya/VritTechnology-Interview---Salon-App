import React, { useState } from "react";
import { IoTrashOutline, IoClose } from "react-icons/io5";
import { useConfirmStore } from "../store/useConfirmStore";

const ConfirmDeleteModal = () => {
    const { isOpen, itemName, onConfirm, close } = useConfirmStore();
    const [deleting, setDeleting] = useState(false);

    if (!isOpen) return null;

    const handleConfirm = async () => {
        if (!onConfirm) return;
        setDeleting(true);
        try {
            await onConfirm();
        } finally {
            setDeleting(false);
            close();
        }
    };

    const handleCancel = () => {
        if (deleting) return;
        close();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={handleCancel}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-gray-100 animate-in fade-in zoom-in-95 duration-150"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Icon */}
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
                    <IoTrashOutline className="text-2xl text-red-600" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                    Delete {itemName}?
                </h3>

                {/* Message */}
                <p className="text-sm text-gray-500 text-center mb-6">
                    This action cannot be undone. The {itemName.toLowerCase()} will be
                    permanently removed.
                </p>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={deleting}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={deleting}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {deleting ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <IoTrashOutline className="text-base" />
                        )}
                        {deleting ? "Deleting…" : "Yes, Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;
