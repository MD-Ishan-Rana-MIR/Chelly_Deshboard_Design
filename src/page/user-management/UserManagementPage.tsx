'use client';

import { useMemo, useState } from "react";
import { FaEye, FaTrash } from "react-icons/fa";
import { FiPower, FiSearch } from "react-icons/fi";

const users = [
    { id: "#221121", name: "John Smith", email: "john@gmail.com", status: "Active" },
    { id: "#221122", name: "John Smith", email: "john@gmail.com", status: "Inactive" },
    { id: "#221123", name: "John Smith", email: "john@gmail.com", status: "Active" },
    { id: "#221124", name: "John Smith", email: "john@gmail.com", status: "Inactive" },
    { id: "#221125", name: "John Smith", email: "john@gmail.com", status: "Active" },
];

export default function UserManagementPage() {

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive">("All");

    // FILTER USERS
    const filteredUsers = useMemo(() => {
        return users.filter((user) => {

            const matchSearch =
                user.name.toLowerCase().includes(search.toLowerCase()) ||
                user.email.toLowerCase().includes(search.toLowerCase()) ||
                user.id.toLowerCase().includes(search.toLowerCase());

            const matchStatus =
                statusFilter === "All"
                    ? true
                    : user.status === statusFilter;

            return matchSearch && matchStatus;
        });
    }, [search, statusFilter]);

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">

            {/* HEADER */}
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    User Management
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Manage all registered users and their status
                </p>
            </div>

            {/* FILTER BAR */}
            <div className="flex flex-col md:flex-row gap-3 mb-5">

                {/* SEARCH */}
                <div className="relative w-full">
                    <FiSearch className="absolute left-4 top-3.5 text-gray-400" />

                    <input
                        type="text"
                        placeholder="Search by name, email or ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full border border-[#207F36]  rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-0"
                    />
                </div>

                {/* STATUS FILTER */}
                <select
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(e.target.value as "All" | "Active" | "Inactive")
                    }
                    className="border border-[#207F36] rounded-xl px-4 py-3 outline-none focus:ring-0"
                >
                    <option value="All">All Users</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>

            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
                <table className="min-w-full">

                    <thead>
                        <tr className="bg-gray-100 text-left text-sm text-gray-600">
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">User Name</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr
                                key={user.id}
                                className="border-b hover:bg-gray-50 transition"
                            >

                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {user.id}
                                </td>

                                <td className="px-6 py-4 font-medium text-gray-800">
                                    {user.name}
                                </td>

                                <td className="px-6 py-4 text-gray-500">
                                    {user.email}
                                </td>

                                <td className="px-6 py-4">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${user.status === "Active"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-200 text-gray-500"
                                            }`}
                                    >
                                        {user.status}
                                    </span>
                                </td>

                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">

                                        <button className="p-2 rounded-full cursor-pointer    hover:bg-green-100">
                                            <FaEye className="text-[#207F36]" />
                                        </button>

                                        <button className="p-2 rounded-full cursor-pointer  hover:bg-yellow-50">
                                            <FiPower
                                                className={
                                                    user.status === "Active"
                                                        ? "text-green-600"
                                                        : "text-red-500"
                                                }
                                            />
                                        </button>

                                        <button className="p-2 rounded-full cursor-pointer hover:bg-red-50">
                                            <FaTrash className="text-red-500" />
                                        </button>

                                    </div>
                                </td>

                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>

        </div>
    );
}