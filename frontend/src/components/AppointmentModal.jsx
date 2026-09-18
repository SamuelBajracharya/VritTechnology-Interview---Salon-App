import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { createAppointment } from "../api/appointmentsAPI";
import { getServices } from "../api/servicesAPI";
import { useAppointmentModalStore } from "../store/useAppointmentModalStore";
import { useToastStore } from "../store/useToastStore";

const EMPTY_FORM = {
    customer_name: "",
    customer_phone: "",
    service: "",
    appointment_date: "",
    appointment_time: "",
    notes: "",
};

const AppointmentModal = () => {
    const { isOpen, onSuccess, close } = useAppointmentModalStore();
    const toast = useToastStore();

    const [services, setServices] = useState([]);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [formErrors, setFormErrors] = useState({});

    // Load services list and reset form each time the modal opens
    useEffect(() => {
        if (!isOpen) return;

        setFormErrors({});

        const fetchServices = async () => {
            try {
                const res = await getServices();
                const list = res.data || [];
                setServices(list);
                setFormData({
                    ...EMPTY_FORM,
                    service: list.length > 0 ? list[0].id : "",
                    appointment_date: new Date().toISOString().split("T")[0],
                    appointment_time: "10:00:00",
                });
            } catch (err) {
                console.error("Failed to load services:", err);
                setFormData({
                    ...EMPTY_FORM,
                    appointment_date: new Date().toISOString().split("T")[0],
                    appointment_time: "10:00:00",
                });
            }
        };

        fetchServices();
    }, [isOpen]);

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
        if (!formData.customer_name.trim()) errors.customer_name = "Customer name is required.";
        if (!formData.customer_phone.trim()) errors.customer_phone = "Customer phone is required.";
        if (!formData.service) errors.service = "Please select a service.";
        if (!formData.appointment_date) errors.appointment_date = "Appointment date is required.";
        if (!formData.appointment_time) errors.appointment_time = "Appointment time is required.";

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            let formattedTime = formData.appointment_time;
            if (formattedTime && formattedTime.length === 5) {
                formattedTime = `${formattedTime}:00`;
            }

            const payload = {
                customer_name: formData.customer_name.trim(),
                customer_phone: formData.customer_phone.trim(),
                service: parseInt(formData.service, 10),
                appointment_date: formData.appointment_date,
                appointment_time: formattedTime,
                notes: formData.notes ? formData.notes.trim() : "",
            };

            await createAppointment(payload);
            toast.success("Appointment booked successfully!");
            close();
            onSuccess?.();
        } catch (err) {
            console.error("Booking error:", err);
            const resData = err.response?.data;
            if (resData?.error) {
                setFormErrors({ general: resData.error });
                toast.error(resData.error);
            } else if (resData && typeof resData === "object") {
                const mapped = {};
                for (const [key, val] of Object.entries(resData)) {
                    mapped[key] = Array.isArray(val) ? val.join(" ") : String(val);
                }
                setFormErrors(mapped);
                toast.error("Please correct the errors in the form.");
            } else {
                setFormErrors({ general: "Failed to book appointment. Please try again." });
                toast.error("Failed to book appointment. Please try again.");
            }
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-3.5 sm:p-4"
            onClick={close}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-5 sm:px-6 py-3.5 sm:py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
                    <div>
                        <h2 className="text-base sm:text-lg font-bold text-gray-800">Book New Appointment</h2>
                        <p className="text-xs text-gray-500">Fill in the details to schedule a customer</p>
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
                        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">
                            ⚠️ {formErrors.general}
                        </div>
                    )}

                    {/* Customer Name */}
                    <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                            Customer Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="customer_name"
                            value={formData.customer_name}
                            onChange={handleInputChange}
                            placeholder="e.g. Ram Sharma"
                            className={`w-full px-3.5 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                formErrors.customer_name
                                    ? "border-red-500 bg-red-50/30"
                                    : "border-gray-300"
                            }`}
                        />
                        {formErrors.customer_name && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.customer_name}</p>
                        )}
                    </div>

                    {/* Customer Phone */}
                    <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                            Customer Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="customer_phone"
                            value={formData.customer_phone}
                            onChange={handleInputChange}
                            placeholder="e.g. 9800000000"
                            className={`w-full px-3.5 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                formErrors.customer_phone
                                    ? "border-red-500 bg-red-50/30"
                                    : "border-gray-300"
                            }`}
                        />
                        {formErrors.customer_phone && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.customer_phone}</p>
                        )}
                    </div>

                    {/* Service */}
                    <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                            Select Service <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="service"
                            value={formData.service}
                            onChange={handleInputChange}
                            className={`w-full px-3.5 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white ${
                                formErrors.service
                                    ? "border-red-500 bg-red-50/30"
                                    : "border-gray-300"
                            }`}
                        >
                            <option value="">-- Choose a service --</option>
                            {services.map((svc) => (
                                <option key={svc.id} value={svc.id}>
                                    {svc.name} — NPR {parseFloat(svc.price).toFixed(2)} ({svc.duration} mins)
                                </option>
                            ))}
                        </select>
                        {formErrors.service && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.service}</p>
                        )}
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                                Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="appointment_date"
                                value={formData.appointment_date}
                                onChange={handleInputChange}
                                className={`w-full px-3.5 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                    formErrors.appointment_date
                                        ? "border-red-500 bg-red-50/30"
                                        : "border-gray-300"
                                }`}
                            />
                            {formErrors.appointment_date && (
                                <p className="text-red-500 text-xs mt-1">
                                    {formErrors.appointment_date}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                                Time <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="time"
                                step="60"
                                name="appointment_time"
                                value={formData.appointment_time}
                                onChange={handleInputChange}
                                className={`w-full px-3.5 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                    formErrors.appointment_time
                                        ? "border-red-500 bg-red-50/30"
                                        : "border-gray-300"
                                }`}
                            />
                            {formErrors.appointment_time && (
                                <p className="text-red-500 text-xs mt-1">
                                    {formErrors.appointment_time}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                            Notes <span className="text-gray-400 font-normal">(Optional)</span>
                        </label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            rows={3}
                            placeholder="Special preferences, hair type, allergies..."
                            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                        />
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
                            Book Appointment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AppointmentModal;
