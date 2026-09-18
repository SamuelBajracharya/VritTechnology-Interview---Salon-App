import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { PiHairDryerFill } from "react-icons/pi";
import { IoCalendarClear, IoClose } from "react-icons/io5";
import { useSidebarStore } from "../store/useSidebarStore";

const Sidebar = () => {
    const location = useLocation();
    const { isOpen, close } = useSidebarStore();

    const links = [
        { path: "/appointments", label: "Appointments", icon: IoCalendarClear },
        { path: "/services", label: "Services", icon: PiHairDryerFill },
    ];

    // Close mobile drawer on route change
    useEffect(() => {
        close();
    }, [location.pathname, close]);

    return (
        <>
            {/* Mobile Backdrop Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
                    onClick={close}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar drawer */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-green-100 p-5 flex flex-col transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 lg:z-auto ${
                    isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:shadow-none"
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 tracking-wide flex items-center gap-2">
                        <span>SalonFlow</span>
                    </h1>
                    <button
                        onClick={close}
                        className="lg:hidden p-1.5 rounded-lg text-gray-600 hover:bg-green-200/60 transition-colors"
                        aria-label="Close sidebar"
                    >
                        <IoClose className="text-xl" />
                    </button>
                </div>

                {/* Nav Links */}
                <nav className="space-y-2 flex-1">
                    {links.map((link) => {
                        const isActive = location.pathname === link.path;
                        const Icon = link.icon;

                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={close}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors ${
                                    isActive
                                        ? "bg-green-600 text-white shadow-xs"
                                        : "text-gray-800 hover:bg-green-600/80 hover:text-white"
                                }`}
                            >
                                <Icon className="text-lg shrink-0" />
                                <span>{link.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Mobile footer hint */}
                <div className="pt-4 border-t border-green-200/70 text-xs text-gray-500">
                    Staff Portal v1.0
                </div>
            </aside>
        </>
    );
};

export default Sidebar;