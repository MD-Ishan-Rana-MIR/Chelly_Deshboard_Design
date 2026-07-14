import { useState } from 'react';
import { FiDownload, FiTrash2, FiX, FiPlus, FiEye } from 'react-icons/fi';
import { useDeleteFoodMutation, useGetFoodsQuery } from '../../api/food/foodApi';
import Pagination from '../../components/pagination/Pagination';
import type { FoodItem } from '../../lib/type/type';
import FoodDetailsModal from './FoodDetailsModal';
import FoodSkeleton from '../../components/skeleton/FoodSkeleton';
import ConfirmModal from '../../lib/alert/ConfirmModal';
import { errorMessage } from '../../lib/msg/errorMsg';
import toast from 'react-hot-toast';
import { FaEdit } from 'react-icons/fa';
import EditForm from './EditFrom';
import { useNavigate } from 'react-router-dom';

export default function Food() {
    const [page, setPage] = useState<number>(1);
    const [per_page, setPerPage] = useState(10);
    const [search, setSearch] = useState<string>('');

    const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

    const { data: foodResponse, isLoading, isFetching, error } = useGetFoodsQuery({
        page,
        per_page,
        search: search || undefined,
    });

    const foodList = foodResponse?.data?.data || [];
    const currentPage = foodResponse?.data?.current_page || 1;
    const lastPage = foodResponse?.data?.last_page || 1;
    const totalItems = foodResponse?.data?.total || 0;

    console.log("foodList",foodList);



    const handleExportCSV = () => {
        if (foodList.length === 0) return;

        const headers = ["ID", "Name", "Category", "Price", "Stock", "Status"];
        const rows = foodList.map((food: FoodItem) => [
            food.id,
            food.name,
            food.category?.name || 'N/A',
            food.price,
            food.stock,
            food.status,
        ]);

        const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `foods_page_${currentPage}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    // ============================================== Food Delete api ===========================================

    const [deletePopUp, setDeletePopUp] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const openDeleteModal = (id: number) => {
        setDeleteId(id);
        setDeletePopUp(true);
    }

    const closeDeletePopUp = () => {
        setDeletePopUp(false);
        setDeleteId(null);
    };



    const [deleteFood, { isLoading: deleteLoading }] = useDeleteFoodMutation();

    const handleDeleteFood = async () => {
        try {
            const res = await deleteFood(deleteId).unwrap();
            if (res) {
                closeDeletePopUp();
                setDeleteId(null);
                setSelectedFood(null);
                setPage(1);
                return toast.success(res?.message)
            }
        } catch (error) {
            console.error("Error deleting food item:", error);
            return errorMessage(error);
        }
    };

    // ================================================ Product Edit Related ==========================================

    const [editData, setEditData] = useState<FoodItem | null>(null);
    const [openEditModal, setOpenEditModal] = useState<boolean>(false);

    const handleEdit = (item: FoodItem) => {
        setEditData(item);
        setOpenEditModal(!openEditModal)
    }



    const navigate = useNavigate();










    return (
        <section className="min-h-screen bg-gray-50 p-6 md:p-10">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Food Management</h1>
                    <p className="text-gray-500">Manage your food items</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={()=>navigate("/admin-dashboard/food-upload")}
                        className="flex items-center gap-2 bg-[#207F36] cursor-pointer text-white px-5 py-3 rounded-2xl font-semibold hover:bg-[#1a6b2c] transition"
                    >
                        <FiPlus /> Add Food
                    </button>
                    <button
                        onClick={handleExportCSV}
                        disabled={foodList.length === 0}
                        className="flex items-center gap-2 cursor-pointer bg-[#207F36] text-white px-5 py-3 rounded-2xl font-semibold hover:bg-[#1a6b2c] transition disabled:opacity-40"
                    >
                        <FiDownload /> Export
                    </button>
                </div>
            </div>

            {/* FILTERS */}
            <div className="flex gap-4 mb-6">
                <input
                    className="border px-4 py-3 border-[#207F36] focus:outline-0 rounded-xl w-full bg-white text-sm"
                    placeholder="Search food..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                />

            </div>

            {/* CONTENT ENGINE */}
            {isLoading ? (
                <FoodSkeleton />
            ) : error ? (
                <div className="bg-rose-50 border border-rose-100 rounded-3xl p-10 text-center text-rose-600">
                    Failed to sync server records.
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
                    <div className="p-5 border-b flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-semibold text-gray-800">Food List</h2>
                            {isFetching && <span className="text-xs text-gray-400 animate-pulse">Syncing...</span>}
                        </div>
                        <span className="text-sm text-gray-500">Total Available: {totalItems}</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px]">
                            <thead className="bg-gray-50">
                                <tr className="text-left text-sm text-gray-600">
                                    <th className="p-4 font-semibold">Food</th>
                                    <th className="p-4 font-semibold">Category</th>
                                    <th className="p-4 font-semibold">Price</th>
                                    <th className="p-4 font-semibold">Variant</th>
                                    <th className="p-4 font-semibold">Stock</th>
                                    <th className="p-4 font-semibold">Status</th>
                                    <th className="p-4 text-right font-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {foodList.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-10 text-center text-gray-400">No food data matching search scope found.</td>
                                    </tr>
                                ) : (
                                    foodList.map((food: FoodItem) => (
                                        <tr key={food.id} className="hover:bg-gray-50/80 transition">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={food.image}
                                                        alt={food.name}
                                                        className="w-14 h-14 rounded-xl object-cover border bg-gray-50"
                                                    />
                                                    <div>
                                                        <h3 className="font-semibold text-gray-800">{food.name}</h3>
                                                        <p className="text-xs text-gray-400">ID: #{food.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                                                    {food.category?.name || "General"}
                                                </span>
                                            </td>
                                            <td className="p-4 font-semibold text-green-600">
                                                ${parseFloat(food.price).toFixed(2)}
                                            </td>
                                            <td className="p-4 font-semibold text-green-600">
                                                {
                                                    food?.variants?.length
                                                }
                                            </td>
                                            <td className="p-4 font-medium">{food.stock}</td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 cursor-pointer rounded-full text-xs font-semibold ${food.status === 'available'
                                                    ? 'bg-green-100 text-green-600 capitalize'
                                                    : 'bg-red-100 text-red-500 capitalize'
                                                    }`}>
                                                    {food.status}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => setSelectedFood(food)}
                                                        className="w-9 h-9 cursor-pointer flex items-center justify-center rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                                                        title="View Details"
                                                    >
                                                        <FiEye size={16} />
                                                    </button>
                                                    {/* <button className="w-9 h-9 cursor-pointer flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition">✏️</button> */}
                                                    <button
                                                        onClick={() => openDeleteModal(food.id)}
                                                        className="w-9 h-9 flex cursor-pointer items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition"
                                                    >
                                                        <FiTrash2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => (handleEdit(food))}
                                                        className="w-9 h-9 cursor-pointer flex items-center justify-center rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                                                    >
                                                        <FaEdit size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINATION CONTROLS */}
                    <Pagination
                        currentPage={page}
                        lastPage={lastPage}
                        totalResults={totalItems}
                        perPage={per_page}
                        isFetching={isFetching}
                        onPageChange={setPage}
                        onPerPageChange={setPerPage}
                    />
                </div>
            )}



            {/* DETACHED FOOD DETAILS VIEW MODAL ELEMENT */}
            <FoodDetailsModal
                food={selectedFood}
                onClose={() => setSelectedFood(null)}
            />
            {/* Modal for delete confirmation */}

            <ConfirmModal
                open={deletePopUp}
                title="Are you sure you want to delete?"
                description="Once deleted, this blog cannot be recovered."
                confirmText={deleteLoading ? 'Deleting...' : "Delete"}
                cancelText="Cancel"
                onConfirm={handleDeleteFood}
                onCancel={closeDeletePopUp}
                loading={deleteLoading}
            />





            {/* Product Edit MOdal  */}


            {/* ADD FOOD MODAL */}
            {openEditModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white w-[90%] max-w-2xl rounded-2xl p-6 relative h-[90vh] overflow-y-auto shadow-2xl">
                        <button
                            onClick={() => setOpenEditModal(false)}
                            className="absolute top-4 cursor-pointer right-4 text-gray-500 hover:text-gray-800 transition"
                        >
                            <FiX size={22} />
                        </button>
                        <EditForm setOpenEditModal={setOpenEditModal} editData={editData} />
                    </div>
                </div>
            )}






        </section>
    );
}