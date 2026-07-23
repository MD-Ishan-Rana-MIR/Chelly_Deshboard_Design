import { useEffect, useState } from "react";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import { MdDashboard, MdSettings } from "react-icons/md";
import { IoChevronDown } from "react-icons/io5";
import { FaBurger } from "react-icons/fa6";
import { FaBlog, FaJediOrder, FaUser, FaBoxOpen } from "react-icons/fa";


export default function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [settingsOpen, setSettingsOpen] = useState(false);

    const { pathname } = useLocation();

    useEffect(() => {
        if (pathname.startsWith("/admin-dashboard/settings")) {
            setSettingsOpen(true);
        }
    }, [pathname]);

    const isActive = (path: string) => pathname === path;

    const token = localStorage.getItem("token");

    // টোকেন না থাকলে লগইন পেজে রিডাইরেক্ট করবে
    if (!token) {
        return <Navigate to="/" replace />;
    }

    const foodManagementActive =
  isActive("/admin-dashboard/food-management") ||
  isActive("/admin-dashboard/food-upload");

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-[#0b7211] to-[#0a4f90]">

            {/* ================= Sidebar ================= */}
            <aside
                className={`fixed left-0 top-0 h-full transition-all duration-300 flex flex-col bg-white/10 backdrop-blur-xl border-r border-white/20
                ${sidebarOpen ? "w-80" : "w-20"}`}
            >

                {/* Logo + Toggle */}
                <div className={`flex items-center py-4 ${sidebarOpen ? "justify-between px-6" : "justify-center"}`}>
                    {sidebarOpen && (
                        <Link to="/admin-dashboard">
                            <img src="/logo/logo.png" className="w-18 h-18 rounded-full " />
                        </Link>
                    )}

                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="text-white text-xl p-2 cursor-pointer rounded hover:bg-white/10"
                    >
                        ☰
                    </button>
                </div>

                {/* ================= Menu ================= */}
                <nav className="flex-1 px-3 py-6 overflow-y-auto">
                    <ul className="space-y-2">

                        {/* Dashboard */}
                        <li>
                            <Link
                                to="/admin-dashboard"
                                className={`flex items-center rounded-lg py-3 transition
                                ${sidebarOpen ? "px-4 gap-3" : "justify-center"}
                                ${isActive("/admin-dashboard")
                                        ? "bg-white activeColor  "
                                        : "text-white hover:bg-white/10"
                                    }`}
                            >
                                <MdDashboard size={28} />
                                {sidebarOpen && <span className=" font-semibold text-xl  ">Dashboard</span>}
                            </Link>
                        </li>

                        {/* User */}
                        <li>
                            <Link
                                to="/admin-dashboard/user-management"
                                className={`flex items-center rounded-lg py-3 transition
                                ${sidebarOpen ? "px-4 gap-3" : "justify-center"}
                                ${isActive("/admin-dashboard/user-management")
                                        ? "bg-white activeColor"
                                        : "text-white hover:bg-white/10"
                                    }`}
                            >
                                <span>
                                    {isActive("/admin-dashboard/user-management") ? <FaUser size={28} /> : <FaUser size={28} />}
                                </span>
                                {sidebarOpen && <span className=" font-semibold text-xl  ">User Management</span>}
                            </Link>
                        </li>


                        {/* Order management  */}
                        <li>
                            <Link
                                to="/admin-dashboard/order-management"
                                className={`flex items-center rounded-lg py-3 transition
                                ${sidebarOpen ? "px-4 gap-3" : "justify-center"}
                                ${isActive("/admin-dashboard/order-management")
                                        ? "bg-white activeColor"
                                        : "text-white hover:bg-white/10"
                                    }`}
                            >
                                <span>
                                    {isActive("/admin-dashboard/order-management") ? <FaJediOrder size={28} /> : <FaJediOrder size={28} />}
                                </span>

                                {sidebarOpen && <span className=" font-semibold text-xl  " >Order Management</span>}
                            </Link>
                        </li>


                        {/* Food management  */}
                        <li>
                            <Link
                                to="/admin-dashboard/food-management"
                                className={`flex items-center rounded-lg py-3 transition
                                ${sidebarOpen ? "px-4 gap-3" : "justify-center"}
                                ${foodManagementActive
                                        ? "bg-white activeColor"
                                        : "text-white hover:bg-white/10"
                                    }`}
                            >
                                <span>
                                    {isActive("/admin-dashboard/food-management") ? <FaBurger size={28} /> : <FaBurger size={28} />}
                                </span>

                                {sidebarOpen && <span className=" font-semibold text-xl  " >Food Management</span>}
                            </Link>
                        </li>

                        {/* EBT Packages */}
                        <li>
                            <Link
                                to="/admin-dashboard/ebt-packages"
                                className={`flex items-center rounded-lg py-3 transition
                                ${sidebarOpen ? "px-4 gap-3" : "justify-center"}
                                ${isActive("/admin-dashboard/ebt-packages")
                                        ? "bg-white activeColor"
                                        : "text-white hover:bg-white/10"
                                    }`}
                            >
                                <span>
                                    {isActive("/admin-dashboard/ebt-packages") ? <FaBoxOpen size={28} /> : <FaBoxOpen size={28} />}
                                </span>

                                {sidebarOpen && <span className=" font-semibold text-xl  " >EBT Packages</span>}
                            </Link>
                        </li>


                        {/* Blog management  */}
                        <li>
                            <Link
                                to="/admin-dashboard/blog-management"
                                className={`flex items-center rounded-lg py-3 transition
                                ${sidebarOpen ? "px-4 gap-3" : "justify-center"}
                                ${isActive("/admin-dashboard/blog-management")
                                        ? "bg-white activeColor"
                                        : "text-white hover:bg-white/10"
                                    }`}
                            >
                                <span>
                                    {isActive("/admin-dashboard/blog-management") ? <FaBlog size={28} /> : <FaBlog size={28} />}
                                </span>

                                {sidebarOpen && <span className=" font-semibold text-xl  " >Blog Management</span>}
                            </Link>
                        </li>



                        {/* Settings */}
                        <li>
                            <button
                                onClick={() => setSettingsOpen(!settingsOpen)}
                                className={`w-full flex items-center rounded-lg py-3 font-semibold text-xl cursor-pointer transition
                                ${sidebarOpen ? "px-4 justify-between" : "justify-center"}
                                ${pathname.startsWith("/admin-dashboard/settings")
                                        ? "bg-white activeColor"
                                        : "text-white hover:bg-white/10"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <MdSettings size={28} />
                                    {sidebarOpen && <span>Settings</span>}
                                </div>

                                {sidebarOpen && (
                                    <IoChevronDown className={`${settingsOpen ? "rotate-180" : ""} transition`} />
                                )}
                            </button>

                            {settingsOpen && sidebarOpen && (
                                <ul className="ml-10 mt-2 space-y-1">
                                    {[
                                        { name: "Personal Info", path: "/admin-dashboard/settings/profile" },
                                        { name: "Store Configuration", path: "/admin-dashboard/settings/store-configuration" },
                                        { name: "Contact Us", path: "/admin-dashboard/settings/contact" },
                                        { name: "Privacy Policy", path: "/admin-dashboard/settings/privacy" },
                                        { name: "Terms & Conditions", path: "/admin-dashboard/settings/terms" },
                                        { name: "Notification", path: "/admin-dashboard/settings/notification" },
                                        // { name: "Payment Guidelines", path: "/admin-dashboard/settings/payment" },
                                        // { name: "FAQs", path: "/admin-dashboard/settings/faq" },
                                    ].map((item) => (
                                        <li key={item.path}>
                                            <Link
                                                to={item.path}
                                                className={`block py-2 px-3 rounded-lg transition
                                                ${isActive(item.path)
                                                        ? "bg-white activeColor"
                                                        : "text-white hover:bg-white/10"
                                                    }`}
                                            >
                                                <span className=" font-semibold text-xl " >
                                                    {item.name}
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>

                    </ul>
                </nav>
            </aside>

            {/* ================= Main ================= */}
            <div
                className={`flex-1 flex flex-col transition-all duration-300
                ${sidebarOpen ? "ml-80" : "ml-20"}`}
            >
                <header className="h-20 bg-white/10 backdrop-blur-xl border-b border-white/20 flex items-center px-6 text-white">
                    <Navbar />
                </header>

                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>

        </div>
    );
}