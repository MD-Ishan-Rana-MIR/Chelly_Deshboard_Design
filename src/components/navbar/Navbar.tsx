"use client";

import { useState, useRef, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
<<<<<<< HEAD
import { FiLogOut, FiUser, FiBell } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../../api/auth/authApi";
import ConfirmModal from "../../lib/alert/ConfirmModal";
import { errorMessage } from "../../lib/msg/errorMsg";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
=======
import { FiLogOut, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
>>>>>>> 7cf21175d7af25a87b5f0171bd78d82c5d61b436

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const [openPopUpModal, setOpenPopUpModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // demo notification count (replace with API later)
    const [notificationCount] = useState(5);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const [logout] = useLogoutMutation();

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

<<<<<<< HEAD
    const navigateToProfile = () => {
        navigate("/admin-dashboard/settings/profile");
        setOpen(false);
    };

    const handleLogoutClick = () => {
        setOpenPopUpModal(true);
    };

    const handleLogoutConfirm = async () => {
        if (isLoading) return;

        try {
            setIsLoading(true);

            const res = await logout({}).unwrap();

            Cookies.remove("token");

            toast.success(res?.message || "Logout successful");

            setOpenPopUpModal(false);
            setOpen(false);

            return navigate("/");
        } catch (error) {
            toast.error("Logout failed!");
            errorMessage(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogoutCancel = () => {
        if (isLoading) return;
        setOpenPopUpModal(false);
=======
    const navigate = useNavigate();

    const navigateToProfile = () => {
        // Implement navigation to profile page
        navigate("/admin-dashboard/settings/profile");
        setOpen(false); // Close dropdown after navigation
>>>>>>> 7cf21175d7af25a87b5f0171bd78d82c5d61b436
    };

    return (
        <>
            <div className="w-full flex justify-between items-center px-6 h-16">

                {/* LEFT */}
                <h1 className="text-xl font-bold text-white">
                    Dashboard
                </h1>

                {/* RIGHT */}
                <div className="flex items-center gap-5">

<<<<<<< HEAD
                    {/* NOTIFICATION ICON */}
                    <div className="relative cursor-pointer">
                        <FiBell className="text-white text-2xl" />
=======
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
>>>>>>> 7cf21175d7af25a87b5f0171bd78d82c5d61b436

                        {notificationCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                {notificationCount}
                            </span>
                        )}
                    </div>

                    {/* USER DROPDOWN */}
                    <div className="relative" ref={dropdownRef}>

                        <button
                            onClick={() => setOpen(!open)}
                            className="flex items-center gap-2 cursor-pointer"
                        >
                            <FaUserCircle size={32} className="text-gray-600" />
                            <span className="font-medium text-white">Admin</span>
                        </button>

                        {open && (
                            <div className="absolute right-0 mt-3 w-48 bg-white border rounded-xl shadow-lg overflow-hidden z-50">

                                {/* Profile */}
                                <button
                                    onClick={navigateToProfile}
                                    className="w-full flex items-center  cursor-pointer gap-2 px-4 py-3 hover:bg-red-50 text-red-500 text-left"
                                >
                                    <FiUser />
                                    Profile
                                </button>

                                {/* Logout */}
                                <button
                                    onClick={handleLogoutClick}
                                    className="w-full flex items-center cursor-pointer  gap-2 px-4 py-3 hover:bg-red-50 text-red-500 text-left"
                                >
                                    <FiLogOut />
                                    Logout
                                </button>

                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* CONFIRM MODAL */}
            <ConfirmModal
                open={openPopUpModal}
                title="Are you sure you want to logout?"
                description="You will need to login again to access your dashboard."
                confirmText={isLoading ? "Logging out..." : "Yes, Logout"}
                cancelText="Cancel"
                onConfirm={handleLogoutConfirm}
                onCancel={handleLogoutCancel}
            />
        </>
    );
};

export default Navbar; 