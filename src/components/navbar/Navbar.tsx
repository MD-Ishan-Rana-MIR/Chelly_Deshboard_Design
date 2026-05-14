"use client";

import  { useState, useRef, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { FiLogOut, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // close dropdown when click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const navigate = useNavigate();

    const navigateToProfile = () => {
        // Implement navigation to profile page
        navigate("/admin-dashboard/settings/profile");
        setOpen(false); // Close dropdown after navigation
    };

    return (
        <div className="w-full flex justify-between items-center px-6 h-16   ">

            {/* LEFT SIDE */}
            <h1 className="text-xl font-bold text-white">
                Dashboard
            </h1>

            {/* RIGHT SIDE */}
            <div className="relative" ref={dropdownRef}>

                {/* Admin Button */}
                <button
                    onClick={() => setOpen(!open)}
                    className="flex items-center gap-2 cursor-pointer"
                >
                    <FaUserCircle size={32} className="text-gray-600" />
                    <span className="font-medium text-white">Admin</span>
                </button>

                {/* Dropdown */}
                {open && (
                    <div className="absolute right-0 mt-3 w-48 bg-white border rounded-xl shadow-lg overflow-hidden z-50">

                        {/* Profile */}
                        <button onClick={navigateToProfile} className="w-full text-black cursor-pointer flex items-center gap-2 px-4 py-3 hover:bg-gray-100 text-left">
                            <FiUser />
                            Profile
                        </button>

                        {/* Logout */}
                        <button className="w-full cursor-pointer flex items-center gap-2 px-4 py-3 hover:bg-red-50 text-red-500 text-left">
                            <FiLogOut />
                            Logout
                        </button>

                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;