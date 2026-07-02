'use client';

import { useMemo, useState } from "react";
import { FaEye, FaTrash } from "react-icons/fa";
import { FiPower, FiSearch, FiX } from "react-icons/fi";
import { useAllUserQuery, useDeleteUserMutation, useUserToggleMutation } from "../../api/user/userApi";
import { imgUrl } from "../../lib/url/url";
import ConfirmModal from "../../lib/alert/ConfirmModal";
import { errorMessage } from "../../lib/msg/errorMsg";
import toast from "react-hot-toast";
import Pagination from "../../components/pagination/Pagination";

export interface UserType {
    id: number;
    name: string;
    email: string;
    avatar: string;
    email_verified_at: string | null;
    phone: string;
    address: string;
    status: "active" | "inactive";
    created_at: string;
    updated_at: string;
}

const ITEMS_PER_PAGE = 10;

export default function UserManagementPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<"All" | "active" | "inactive">("All");

    const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
    const [id, setId] = useState<number | null>(null);
    const [openPopUpModal, setOpenPopUpModal] = useState<boolean>(false);
    const [deletePopUp, setDeletePopUp] = useState(false);

    // RTK Query API Fetch
    const { data, isFetching } = useAllUserQuery(undefined);
    const users: UserType[] = data?.data?.data || [];

    // const meta = {
    //     current_page: data?.meta?.current_page || 1,
    //     last_page: data?.meta?.last_page || 1,
    //     total: data?.meta?.total || 0
    // };

    // FILTER USERS
    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const matchSearch =
                user.name.toLowerCase().includes(search.toLowerCase()) ||
                user.email.toLowerCase().includes(search.toLowerCase()) ||
                user.id.toString().includes(search);

            const matchStatus =
                statusFilter === "All" ? true : user.status === statusFilter;

            return matchSearch && matchStatus;
        });
    }, [users, search, statusFilter]);

    // PAGINATION LOGIC
    const paginatedUsers = useMemo(() => {
        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredUsers, page]);

    // Find user for the status modal details
    const activeToggleUser = useMemo(() => {
        return users.find(u => u.id === id) || null;
    }, [users, id]);

    // ============================================ Toggle User =======================================
    const [userToggle, { isLoading: toggleLoading }] = useUserToggleMutation();

    const handleOpenPopUpModal = (id: number) => {
        setOpenPopUpModal(true);
        setId(id);
    };

    const closePopUpModal = () => {
        setOpenPopUpModal(false);
        setId(null);
    };

    const handletoggleUser = async () => {
        try {
            const res = await userToggle(id).unwrap();
            if (res) {
                setOpenPopUpModal(false);
                setId(null);
                toast.success(res?.message || "Status updated successfully");
            }
        } catch (error) {
            errorMessage(error);
        }
    };

    // ==================================================== Delete User API ============================================
    const [deleteUser, { isLoading: deleteLoading }] = useDeleteUserMutation();

    const openDeletePopUpModal = (id: number) => {
        setDeletePopUp(true);
        setId(id);
    };

    const handleDelete = async () => {
        try {
            const res = await deleteUser(id).unwrap();
            if (res) {
                setDeletePopUp(false);
                setId(null);
                toast.success(res?.message || "User deleted successfully");
            }
        } catch (error) {
            errorMessage(error);
        }
    };

    const deleteModalClose = () => {
        setDeletePopUp(false);
        setId(null);
    };

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
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1); // Reset to first page on filtering
                        }}
                        className="w-full border border-[#207F36] rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-0"
                    />
                </div>

                {/* STATUS FILTER */}
                <select
                    value={statusFilter}
                    onChange={(e) => {
                        setStatusFilter(e.target.value as "All" | "active" | "inactive");
                        setPage(1); // Reset to first page on filtering
                    }}
                    className="border border-[#207F36] rounded-xl px-4 py-3 outline-none focus:ring-0"
                >
                    <option value="All">All Users</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
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
                        {paginatedUsers.map((user) => (
                            <tr
                                key={user.id}
                                className="border-b hover:bg-gray-50 transition"
                            >
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    #{user.id}
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-800">
                                    {user.name}
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${user.status === "active"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-500"
                                            }`}
                                    >
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        {/* VIEW */}
                                        <button
                                            onClick={() => setSelectedUser(user)}
                                            className="p-2 rounded-full cursor-pointer hover:bg-green-100"
                                        >
                                            <FaEye className="text-[#207F36]" />
                                        </button>

                                        {/* STATUS */}
                                        <button
                                            onClick={() => handleOpenPopUpModal(user.id)}
                                            className="p-2 rounded-full cursor-pointer hover:bg-yellow-50"
                                        >
                                            <FiPower
                                                className={
                                                    user.status === "active"
                                                        ? "text-green-600"
                                                        : "text-red-500"
                                                }
                                            />
                                        </button>

                                        {/* DELETE */}
                                        <button
                                            onClick={() => openDeletePopUpModal(user.id)}
                                            className="p-2 rounded-full cursor-pointer hover:bg-red-50"
                                        >
                                            <FaTrash className="text-red-500" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
            <div className="mt-6">
                <Pagination
                    currentPage={page}
                    lastPage={Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)}
                    totalResults={filteredUsers.length}
                    perPage={ITEMS_PER_PAGE}
                    isFetching={isFetching}
                    onPageChange={setPage}
                    onPerPageChange={() => { }} // Fixed static perPage configuration
                />
            </div>

            {/* USER DETAILS MODAL */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden">
                        {/* HEADER */}
                        <div className="flex items-center justify-between border-b px-6 py-4">
                            <h2 className="text-xl font-bold text-gray-800">
                                User Details
                            </h2>
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="p-2 cursor-pointer rounded-full hover:bg-gray-100"
                            >
                                <FiX className="text-gray-600 text-lg" />
                            </button>
                        </div>

                        {/* BODY */}
                        <div className="p-6">
                            {/* AVATAR */}
                            <div className="flex flex-col items-center mb-6">
                                <img
                                    src={`${imgUrl}/${selectedUser.avatar}`}
                                    alt={selectedUser.name}
                                    className="w-24 h-24 rounded-full object-cover border-4 border-[#207F36]/20"
                                />
                                <h3 className="mt-4 text-xl font-semibold text-gray-800">
                                    {selectedUser.name}
                                </h3>
                                <span
                                    className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold ${selectedUser.status === "active"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-500"
                                        }`}
                                >
                                    {selectedUser.status}
                                </span>
                            </div>

                            {/* DETAILS */}
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <h4 className="font-medium text-gray-800">{selectedUser.email}</h4>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Phone</p>
                                    <h4 className="font-medium text-gray-800">{selectedUser.phone || "N/A"}</h4>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Address</p>
                                    <h4 className="font-medium text-gray-800">{selectedUser.address || "N/A"}</h4>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Created At</p>
                                    <h4 className="font-medium text-gray-800">
                                        {new Date(selectedUser.created_at).toLocaleString()}
                                    </h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TOGGLE STATUS MODAL */}
            <ConfirmModal
                open={openPopUpModal}
                title={`Are you sure you want to ${activeToggleUser?.status === "active" ? "deactivate" : "activate"} this user?`}
                description={`This user will be ${activeToggleUser?.status === "active" ? "disabled from accessing the system." : "able to access the system again."}`}
                confirmText={
                    toggleLoading
                        ? "Processing..."
                        : activeToggleUser?.status === "active"
                            ? "Deactivate"
                            : "Activate"
                }
                cancelText="Cancel"
                onConfirm={handletoggleUser}
                onCancel={closePopUpModal}
                loading={toggleLoading}
            />

            {/* DELETE MODAL */}
            <ConfirmModal
                open={deletePopUp}
                title="Are you sure you want to delete this user?"
                description="Once deleted, this user cannot be recovered."
                confirmText={deleteLoading ? 'Deleting...' : "Delete"}
                cancelText="Cancel"
                onConfirm={handleDelete}
                onCancel={deleteModalClose}
                loading={deleteLoading}
            />
        </div>
    );
}