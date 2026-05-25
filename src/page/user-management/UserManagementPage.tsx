'use client';

import { useMemo, useState } from "react";
import { FaEye, FaTrash } from "react-icons/fa";
import {
    FiChevronLeft,
    FiChevronRight,
    FiPower,
    FiSearch,
    FiX,
} from "react-icons/fi";

import { useAllUserQuery, useDeleteUserMutation, useUserToggleMutation } from "../../api/user/userApi";
import { imgUrl } from "../../lib/url/url";
import ConfirmModal from "../../lib/alert/ConfirmModal";
import { errorMessage } from "../../lib/msg/errorMsg";
import toast from "react-hot-toast";

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

const ITEMS_PER_PAGE = 5;

export default function UserManagementPage() {

    const { data } = useAllUserQuery(undefined);

    const users: UserType[] = data?.data?.data || [];

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

    const [statusFilter, setStatusFilter] = useState<
        "All" | "active" | "inactive"
    >("All");

    // FILTER USERS
    const filteredUsers = useMemo(() => {
        return users.filter((user) => {

            const matchSearch =
                user.name.toLowerCase().includes(search.toLowerCase()) ||
                user.email.toLowerCase().includes(search.toLowerCase()) ||
                user.id.toString().includes(search);

            const matchStatus =
                statusFilter === "All"
                    ? true
                    : user.status === statusFilter;

            return matchSearch && matchStatus;
        });
    }, [users, search, statusFilter]);

    // PAGINATION
    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

    const paginatedUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;

        return filteredUsers.slice(startIndex, endIndex);
    }, [filteredUsers, currentPage]);


    // ============================================ Toggle User =======================================

    const [userToggle, { isLoading: toggleLoading }] = useUserToggleMutation();

    const [id, setId] = useState<number | null>(null);

    const [openPopUpModal, setOpenPopUpModal] = useState<boolean>(false);

    const handleOpenPopUpModal = (id: number) => {
        setOpenPopUpModal(true);
        setId(id);
    }

    const closePopUpModal = () => {
        setOpenPopUpModal(false);
        setId(null);
    }

    const handletoggleUser = async () => {
        try {
            const res = await userToggle(id).unwrap();
            if (res) {
                setOpenPopUpModal(false);
                setId(null);
                return toast.success(res?.message);
            }
        } catch (error) {
            return errorMessage(error)
        }
    }


    // ==================================================== Deleete user api ============================================

    const [deleteUser,{isLoading:deleteLoading}] = useDeleteUserMutation();

    const [deletePopUp, setDeletePopUp] = useState(false);

    const openDeletePopUpModal = (id: number) => {
        setDeletePopUp(true);
        setId(id)
    };

    const handleDelete = async ()=>{
        try {
            const res = await deleteUser(id).unwrap();
            if(res){
                return toast.success(res?.message);
            }
        } catch (error) {
            return errorMessage(error)
        }
    }

    const deleteModalClose = ()=>{
        setDeletePopUp(false);
        setId(null);
    }



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
                            setCurrentPage(1);
                        }}
                        className="w-full border border-[#207F36] rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-0"
                    />
                </div>

                {/* STATUS FILTER */}
                <select
                    value={statusFilter}
                    onChange={(e) => {
                        setStatusFilter(
                            e.target.value as "All" | "active" | "inactive"
                        );

                        setCurrentPage(1);
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
                                        <button onClick={() => { handleOpenPopUpModal(user?.id) }} className="p-2 rounded-full cursor-pointer hover:bg-yellow-50">
                                            <FiPower
                                                className={
                                                    user.status === "active"
                                                        ? "text-green-600"
                                                        : "text-red-500"
                                                }
                                            />
                                        </button>

                                        {/* DELETE */}
                                        <button onClick={()=>{openDeletePopUpModal(user?.id)}} className="p-2 rounded-full cursor-pointer hover:bg-red-50">
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
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">

                    <p className="text-sm text-gray-500">
                        Showing{" "}
                        <span className="font-semibold">
                            {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                        </span>{" "}
                        to{" "}
                        <span className="font-semibold">
                            {Math.min(
                                currentPage * ITEMS_PER_PAGE,
                                filteredUsers.length
                            )}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold">
                            {filteredUsers.length}
                        </span>{" "}
                        users
                    </p>

                    <div className="flex items-center gap-2">

                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                            className="w-10 h-10 rounded-lg border flex items-center justify-center disabled:opacity-50"
                        >
                            <FiChevronLeft />
                        </button>

                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentPage(index + 1)}
                                className={`w-10 h-10 rounded-lg border text-sm font-medium ${currentPage === index + 1
                                    ? "bg-[#207F36] text-white border-[#207F36]"
                                    : "hover:bg-gray-100"
                                    }`}
                            >
                                {index + 1}
                            </button>
                        ))}

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(currentPage + 1)}
                            className="w-10 h-10 rounded-lg border flex items-center justify-center disabled:opacity-50"
                        >
                            <FiChevronRight />
                        </button>

                    </div>
                </div>
            )}

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
                                    <p className="text-sm text-gray-500">
                                        Email
                                    </p>

                                    <h4 className="font-medium text-gray-800">
                                        {selectedUser.email}
                                    </h4>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">
                                        Phone
                                    </p>

                                    <h4 className="font-medium text-gray-800">
                                        {selectedUser.phone || "N/A"}
                                    </h4>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">
                                        Address
                                    </p>

                                    <h4 className="font-medium text-gray-800">
                                        {selectedUser.address || "N/A"}
                                    </h4>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">
                                        Created At
                                    </p>

                                    <h4 className="font-medium text-gray-800">
                                        {new Date(
                                            selectedUser.created_at
                                        ).toLocaleString()}
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
                title={`Are you sure you want to ${selectedUser?.status === "active"
                    ? "deactivate"
                    : "activate"
                    } this user?`}
                description={`This user will be ${selectedUser?.status === "active"
                    ? "disabled from accessing the system."
                    : "able to access the system again."
                    }`}
                confirmText={
                    toggleLoading
                        ? "Processing..."
                        : selectedUser?.status === "active"
                            ? "Deactivate"
                            : "Activate"
                }
                cancelText="Cancel"
                onConfirm={handletoggleUser}
                onCancel={closePopUpModal}
                loading={toggleLoading}
            />


            <ConfirmModal
                open={deletePopUp}
                title="Are you sure you want to sure delete?"
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