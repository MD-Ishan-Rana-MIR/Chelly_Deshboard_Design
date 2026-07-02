import { useState, useRef, useEffect } from "react";
import { FiLogOut, FiUser, FiBell } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAdminProfileQuery, useLogoutMutation } from "../../api/auth/authApi";
import ConfirmModal from "../../lib/alert/ConfirmModal";
import { errorMessage } from "../../lib/msg/errorMsg";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { imgUrl } from "../../lib/url/url";
import { useGetNotificationsQuery } from "../../api/notification/notificationApi";


const Navbar = () => {
    const [open, setOpen] = useState(false);
    const [openPopUpModal, setOpenPopUpModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // ========================================= Admin Profile Api ===============================

    const { data } = useAdminProfileQuery(undefined);





    // demo notification count (replace with API later)

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
            localStorage.removeItem("token");

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
    };


    //=================================================== Notification Length =============================================
    const { data: notificationsData } = useGetNotificationsQuery({ page: 1, perPage: 10000000 });

    // 1. Safely extract the inner data array (fall back to an empty array if loading)
    const notificationsList = notificationsData?.data || [];

    // 2. Filter out only unread items safely
    const unreadNotifications = notificationsList.filter(
        (notification) => notification.read_at === null
    );

    // 3. Get the dynamic length of unread items on this page
    const unreadLength = unreadNotifications.length;



    return (
        <>
            <div className="w-full flex justify-between items-center px-6 h-16">

                {/* LEFT */}
                <h1 className="text-xl font-bold text-white">
                    Dashboard
                </h1>

                {/* RIGHT */}
                <div className="flex items-center gap-5">

                    {/* NOTIFICATION ICON */}
                    <div onClick={() => { navigate("/admin-dashboard/settings/notification") }} className="relative cursor-pointer">
                        <FiBell className="text-white text-2xl" />

                        {unreadLength > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                {unreadLength}
                            </span>
                        )}
                    </div>

                    {/* USER DROPDOWN */}
                    <div className="relative" ref={dropdownRef}>

                        <button
                            onClick={() => setOpen(!open)}
                            className="flex items-center gap-2 cursor-pointer"
                        >
                            <img src={`${imgUrl}/${data?.data?.avatar}`} className=" w-10 h-10 rounded-full  " width={40} height={40} />
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