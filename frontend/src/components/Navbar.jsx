import React from "react";
import { useLocation } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import { useSidebarStore } from "../store/useSidebarStore";

const Navbar = () => {
    const location = useLocation();
    const { toggle } = useSidebarStore();

    const getTitle = () => {
        switch (location.pathname) {
            case "/appointments":
                return "Appointments";
            case "/services":
                return "Services";
            default:
                return "Salon Admin";
        }
    };

    return (
        <header className="border-b border-green-200 h-16 sm:h-20 flex justify-between items-center px-4 sm:px-6 bg-[#eef2ee]/80 backdrop-blur-xs sticky top-0 z-30">
            <div className="flex items-center gap-3">
                {/* Mobile hamburger button */}
                <button
                    onClick={toggle}
                    className="lg:hidden p-2 -ml-1 text-gray-700 hover:text-green-800 hover:bg-green-200/50 rounded-lg transition-colors cursor-pointer"
                    aria-label="Toggle navigation menu"
                >
                    <IoMenu className="text-2xl" />
                </button>

                <h1 className="text-xl sm:text-2xl text-green-900 font-bold tracking-tight">
                    {getTitle()}
                </h1>
            </div>


        </header>
    );
};

export default Navbar;