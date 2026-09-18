import React, { useState, useEffect } from "react";
import {
    IoAdd,
    IoSearch,
    IoCheckmarkOutline,
    IoCloseOutline,
    IoTrashOutline,
} from "react-icons/io5";
import {
    getAppointments,
    updateAppointmentStatus,
    deleteAppointment,
} from "../api/appointmentsAPI";
import { useToastStore } from "../store/useToastStore";
import { useConfirmStore } from "../store/useConfirmStore";
import { useAppointmentModalStore } from "../store/useAppointmentModalStore";

const STATUS_OPTIONS = ["All", "Pending", "Confirmed", "Completed", "Cancelled"];

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const toast = useToastStore();
    const confirm = useConfirmStore();
    const appointmentModal = useAppointmentModalStore();

    // Fetch appointments
    const fetchAppointments = async (statusFilter = selectedFilter) => {
        try {
            const statusParam = statusFilter === "All" ? undefined : statusFilter;
            const response = await getAppointments(statusParam);
            setAppointments(response.data || []);
        } catch (err) {
            console.error("Failed to load appointments:", err);
            toast.error("Failed to load appointments. Please check your backend connection.");
        }
    };

    useEffect(() => {
        fetchAppointments(selectedFilter);
    }, [selectedFilter]);

    const handleFilterChange = (e) => {
        setSelectedFilter(e.target.value);
    };

    const handleStatusTransition = async (appointmentId, newStatus) => {
        try {
            await updateAppointmentStatus(appointmentId, newStatus);
            toast.success(`Appointment status updated to "${newStatus}".`);
            fetchAppointments(selectedFilter);
        } catch (err) {
            console.error("Status update error:", err);
            const msg = err.response?.data?.error || "Failed to update appointment status.";
            toast.error(msg);
        }
    };

    const handleDeleteRequest = (appt) => {
        confirm.open("appointment", async () => {
            try {
                await deleteAppointment(appt.id);
                toast.success("Appointment deleted successfully.");
                fetchAppointments(selectedFilter);
            } catch (err) {
                console.error("Delete appointment error:", err);
                toast.error(err.response?.data?.error || "Failed to delete appointment.");
            }
        });
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case "Confirmed":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "Completed":
                return "bg-emerald-100 text-emerald-800 border-emerald-200";
            case "Cancelled":
                return "bg-rose-100 text-rose-800 border-rose-200";
            case "Pending":
            default:
                return "bg-amber-100 text-amber-800 border-amber-200";
        }
    };

    // Client-side filter by customer name
    const filteredAppointments = appointments.filter((appt) =>
        appt.customer_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Responsive Header & Action Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-green-900 tracking-tight">
                        Manage Customer Appointments
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                        Track bookings, update workflow statuses, and prevent scheduling conflicts
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
                    {/* Search by name */}
                    <div className="relative flex-1 sm:flex-initial">
                        <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full sm:w-48 lg:w-56 pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 shadow-2xs"
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        id="status-filter"
                        value={selectedFilter}
                        onChange={handleFilterChange}
                        className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer shadow-2xs"
                    >
                        {STATUS_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                                {opt === "All" ? "All Statuses" : opt}
                            </option>
                        ))}
                    </select>

                    {/* Book Appointment CTA */}
                    <button
                        onClick={() => appointmentModal.open(fetchAppointments)}
                        className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors shadow-xs cursor-pointer inline-flex items-center justify-center gap-1.5 text-sm shrink-0"
                    >
                        <IoAdd className="text-lg" />
                        <span>Book Appointment</span>
                    </button>
                </div>
            </div>

            {/* Content Container */}
            <div className="bg-white rounded-xl overflow-hidden">
                {filteredAppointments.length === 0 ? (
                    <div className="p-8 sm:p-12 text-center text-gray-500">
                        <p className="text-base font-semibold text-gray-700">No appointments found</p>
                        <p className="text-sm mt-1">
                            {searchQuery
                                ? `No results for "${searchQuery}".`
                                : selectedFilter === "All"
                                ? "Schedule your first salon appointment."
                                : `No appointments with status "${selectedFilter}".`}
                        </p>
                        {!searchQuery && (
                            <button
                                onClick={() => appointmentModal.open(fetchAppointments)}
                                className="mt-4 inline-flex items-center gap-1.5 bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 cursor-pointer"
                            >
                                <IoAdd className="text-base" />
                                <span>Book Appointment</span>
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[760px] text-left">
                            <thead className="bg-green-600 text-white">
                                <tr>
                                    <th className="px-5 sm:px-6 py-3.5 sm:py-4 text-xs font-semibold uppercase tracking-wider">ID</th>
                                    <th className="px-5 sm:px-6 py-3.5 sm:py-4 text-xs font-semibold uppercase tracking-wider">Customer</th>
                                    <th className="px-5 sm:px-6 py-3.5 sm:py-4 text-xs font-semibold uppercase tracking-wider">Service</th>
                                    <th className="px-5 sm:px-6 py-3.5 sm:py-4 text-xs font-semibold uppercase tracking-wider">Date & Time</th>
                                    <th className="px-5 sm:px-6 py-3.5 sm:py-4 text-xs font-semibold uppercase tracking-wider">Status</th>
                                    <th className="px-5 sm:px-6 py-3.5 sm:py-4 text-xs font-semibold uppercase tracking-wider">Notes</th>
                                    <th className="text-right px-5 sm:px-6 py-3.5 sm:py-4 text-xs font-semibold uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200">
                                {filteredAppointments.map((appt) => (
                                    <tr key={appt.id} className="hover:bg-green-100/50 transition-colors">
                                        <td className="px-5 sm:px-6 py-3.5 sm:py-4 text-sm text-gray-500 font-mono">
                                            #{appt.id}
                                        </td>

                                        <td className="px-5 sm:px-6 py-3.5 sm:py-4 text-sm">
                                            <div className="font-semibold text-gray-900">{appt.customer_name}</div>
                                            <div className="text-xs text-gray-500">{appt.customer_phone}</div>
                                        </td>

                                        <td className="px-5 sm:px-6 py-3.5 sm:py-4 text-sm font-medium text-gray-800">
                                            {appt.service_name || `Service #${appt.service}`}
                                        </td>

                                        <td className="px-5 sm:px-6 py-3.5 sm:py-4 text-sm text-gray-700 whitespace-nowrap">
                                            <div className="font-medium">{appt.appointment_date}</div>
                                            <div className="text-xs text-gray-500">{appt.appointment_time}</div>
                                        </td>

                                        <td className="px-5 sm:px-6 py-3.5 sm:py-4 text-sm">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(appt.status)}`}
                                            >
                                                {appt.status}
                                            </span>
                                        </td>

                                        <td className="px-5 sm:px-6 py-3.5 sm:py-4 text-sm text-gray-500 max-w-xs truncate">
                                            {appt.notes || "—"}
                                        </td>

                                        <td className="px-5 sm:px-6 py-3.5 sm:py-4 text-sm text-right whitespace-nowrap">
                                            <div className="flex justify-end items-center gap-1.5 flex-wrap">
                                                {/* Status Transitions */}
                                                {appt.status === "Pending" && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusTransition(appt.id, "Confirmed")}
                                                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors cursor-pointer"
                                                        >
                                                            <IoCheckmarkOutline className="text-xs" />
                                                            <span>Confirm</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusTransition(appt.id, "Cancelled")}
                                                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200 rounded-md hover:bg-rose-100 transition-colors cursor-pointer"
                                                        >
                                                            <IoCloseOutline className="text-xs" />
                                                            <span>Cancel</span>
                                                        </button>
                                                    </>
                                                )}

                                                {appt.status === "Confirmed" && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusTransition(appt.id, "Completed")}
                                                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md hover:bg-emerald-100 transition-colors cursor-pointer"
                                                        >
                                                            <IoCheckmarkOutline className="text-xs" />
                                                            <span>Complete</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusTransition(appt.id, "Cancelled")}
                                                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200 rounded-md hover:bg-rose-100 transition-colors cursor-pointer"
                                                        >
                                                            <IoCloseOutline className="text-xs" />
                                                            <span>Cancel</span>
                                                        </button>
                                                    </>
                                                )}

                                                {/* Delete Button */}
                                                <button
                                                    onClick={() => handleDeleteRequest(appt)}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200 rounded-md hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors cursor-pointer ml-1"
                                                >
                                                    <IoTrashOutline className="text-xs" />
                                                    <span>Delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Appointments;