import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { createService, updateService } from "../api/servicesAPI";
import { useServiceModalStore } from "../store/useServiceModalStore";
import { useToastStore } from "../store/useToastStore";

const EMPTY_FORM = { name: "", price: "", duration: "" };

const ServiceModal = () => {
    const { isOpen, editingService, onSuccess, close } = useServiceModalStore();
    const toast = useToastStore();

    const [formData, setFormData] = useState(EMPTY_FORM);
    const [formErrors, setFormErrors] = useState({});

    // Sync form whenever the modal opens / editingService changes
    useEffect(() => {
        if (isOpen) {
            setFormData(
                editingService
                    ? {
                          name: editingService.name,
                          price: editingService.price,
                          duration: editingService.duration,
                      }
                    : EMPTY_FORM
            );
            setFormErrors({});
        }
    }, [isOpen, editingService]);

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErrors({});

        const errors = {};
        if (!formData.name.trim()) errors.name = "Service name is required.";
        if (!formData.price || parseFloat(formData.price) <= 0)
            errors.price = "Price must be greater than zero.";
        if (!formData.duration || parseInt(formData.duration, 10) <= 0)
            errors.duration = "Duration must be greater than zero.";

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            const payload = {
                name: formData.name.trim(),
                price: parseFloat(formData.price).toFixed(2),
                duration: parseInt(formData.duration, 10),
            };

            if (editingService) {
                await updateService(editingService.id, payload);
                toast.success(`Service "${payload.name}" updated successfully.`);
            } else {
                await createService(payload);
                toast.success(`Service "${payload.name}" added successfully.`);
            }

            close();
            onSuccess?.();
        } catch (err) {
            console.error("Save service failed:", err);
            const serverErrors = err.response?.data;
            if (serverErrors && typeof serverErrors === "object") {
                const mappedErrors = {};
                for (const [key, val] of Object.entries(serverErrors)) {
                    mappedErrors[key] = Array.isArray(val) ? val.join(" ") : String(val);
                }
                setFormErrors(mappedErrors);
                toast.error("Please correct the errors in the form.");
            } else {
                setFormErrors({ general: "An error occurred while saving the service." });
                toast.error("An error occurred while saving the service.");
            }
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-3.5 sm:p-4"
            onClick={close}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-5 sm:px-6 py-3.5 sm:py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
                    <div>
                        <h2 className="text-base sm:text-lg font-bold text-gray-800">
                            {editingService ? "Edit Service" : "Add New Service"}
                        </h2>
                        <p className="text-xs text-gray-500">Service details and pricing</p>
                    </div>
                    <button
                        onClick={close}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors cursor-pointer"
                        aria-label="Close"
                    >
                        <IoClose className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
                    {formErrors.general && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-medium">
                            {formErrors.general}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                            Service Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="e.g. Haircut & Styling"
                            className={`w-full px-3.5 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                formErrors.name ? "border-red-500 bg-red-50/30" : "border-gray-300"
                            }`}
                        />
                        {formErrors.name && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                            Price (NPR) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            placeholder="e.g. 500.00"
                            className={`w-full px-3.5 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                formErrors.price ? "border-red-500 bg-red-50/30" : "border-gray-300"
                            }`}
                        />
                        {formErrors.price && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.price}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                            Duration (minutes) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            step="1"
                            min="1"
                            name="duration"
                            value={formData.duration}
                            onChange={handleInputChange}
                            placeholder="e.g. 30"
                            className={`w-full px-3.5 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                formErrors.duration
                                    ? "border-red-500 bg-red-50/30"
                                    : "border-gray-300"
                            }`}
                        />
                        {formErrors.duration && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.duration}</p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={close}
                            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer text-center"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="w-full sm:w-auto px-5 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                        >
                            {editingService ? "Update Service" : "Create Service"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ServiceModal;
