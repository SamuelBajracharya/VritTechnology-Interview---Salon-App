import React, { useState, useEffect } from "react";
import { IoAdd, IoPencilOutline, IoTrashOutline } from "react-icons/io5";
import { getServices, deleteService } from "../api/servicesAPI";
import { useToastStore } from "../store/useToastStore";
import { useConfirmStore } from "../store/useConfirmStore";
import { useServiceModalStore } from "../store/useServiceModalStore";

const Services = () => {
    const [services, setServices] = useState([]);
    const toast = useToastStore();
    const confirm = useConfirmStore();
    const serviceModal = useServiceModalStore();

    const fetchServices = async () => {
        try {
            const response = await getServices();
            setServices(response.data || []);
        } catch (err) {
            console.error("Failed to fetch services:", err);
            toast.error("Failed to load services. Please ensure the backend server is running.");
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleDeleteRequest = (service) => {
        confirm.open("service", async () => {
            try {
                await deleteService(service.id);
                toast.success(`Service "${service.name}" deleted successfully.`);
                fetchServices();
            } catch (err) {
                console.error("Delete service failed:", err);
                toast.error(
                    err.response?.data?.error ||
                    err.response?.data?.detail ||
                    "Failed to delete service."
                );
            }
        });
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Responsive Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-green-900 tracking-tight">
                        Manage Salon Services
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                        Define service catalog, pricing in NPR, and estimated durations
                    </p>
                </div>

                <button
                    onClick={() => serviceModal.openAdd(fetchServices)}
                    className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors shadow-xs cursor-pointer inline-flex items-center justify-center gap-1.5 text-sm shrink-0"
                >
                    <IoAdd className="text-lg" />
                    <span>Add Service</span>
                </button>
            </div>

            {/* Content Container */}
            <div className="bg-white rounded-xl overflow-hidden">
                {services.length === 0 ? (
                    <div className="p-8 sm:p-12 text-center text-gray-500">
                        <p className="text-base font-semibold text-gray-700">No services found</p>
                        <p className="text-sm mt-1">Get started by adding your first salon service.</p>
                        <button
                            onClick={() => serviceModal.openAdd(fetchServices)}
                            className="mt-4 inline-flex items-center gap-1.5 bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 cursor-pointer"
                        >
                            <IoAdd className="text-base" />
                            <span>Add Service</span>
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px] text-left">
                            <thead className="bg-green-600 text-white">
                                <tr>
                                    <th className="px-5 sm:px-6 py-3.5 sm:py-4 text-xs font-semibold uppercase tracking-wider">ID</th>
                                    <th className="px-5 sm:px-6 py-3.5 sm:py-4 text-xs font-semibold uppercase tracking-wider">Service Name</th>
                                    <th className="px-5 sm:px-6 py-3.5 sm:py-4 text-xs font-semibold uppercase tracking-wider">Price</th>
                                    <th className="px-5 sm:px-6 py-3.5 sm:py-4 text-xs font-semibold uppercase tracking-wider">Duration</th>
                                    <th className="text-right px-5 sm:px-6 py-3.5 sm:py-4 text-xs font-semibold uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200">
                                {services.map((service) => (
                                    <tr key={service.id} className="hover:bg-green-100/50 transition-colors">
                                        <td className="px-5 sm:px-6 py-3.5 sm:py-4 text-sm text-gray-500 font-mono">#{service.id}</td>
                                        <td className="px-5 sm:px-6 py-3.5 sm:py-4 text-sm font-semibold text-gray-900">{service.name}</td>
                                        <td className="px-5 sm:px-6 py-3.5 sm:py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                            NPR {parseFloat(service.price).toFixed(2)}
                                        </td>
                                        <td className="px-5 sm:px-6 py-3.5 sm:py-4 text-sm text-gray-600 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                {service.duration} mins
                                            </span>
                                        </td>
                                        <td className="px-5 sm:px-6 py-3.5 sm:py-4 text-sm text-right whitespace-nowrap">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => serviceModal.openEdit(service, fetchServices)}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 rounded-md hover:bg-amber-100 transition-colors cursor-pointer"
                                                >
                                                    <IoPencilOutline className="text-sm" />
                                                    <span>Edit</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteRequest(service)}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-red-50 text-red-700 border border-red-200 rounded-md hover:bg-red-100 transition-colors cursor-pointer"
                                                >
                                                    <IoTrashOutline className="text-sm" />
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

export default Services;