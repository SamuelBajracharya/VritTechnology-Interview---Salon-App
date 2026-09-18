import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Toast from "./Toast";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import ServiceModal from "./ServiceModal";
import AppointmentModal from "./AppointmentModal";

function Layout() {
    return (
        <div className="flex min-h-screen bg-[#eef2ee] relative overflow-x-hidden">
            <Toast />
            <ConfirmDeleteModal />
            <ServiceModal />
            <AppointmentModal />

            {/* Sidebar (drawer on mobile, fixed column on desktop) */}
            <Sidebar />

            {/* Main area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Navbar */}
                <Navbar />

                {/* Page content */}
                <main className="p-3.5 sm:p-6 lg:p-8 flex-1 min-w-0">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default Layout;