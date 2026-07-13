
import { useState, type ChangeEvent } from 'react';
import { FiEdit, FiPlus, FiTrash2, FiX } from 'react-icons/fi';
import {
    useAllCategoryQuery,
    useDeleteCategoryMutation,
    usePostCategoryMutation,
    useUpdateCateotgryMutation
} from '../../api/category/categoryApi';
import ConfirmModal from '../../lib/alert/ConfirmModal';
import { errorMessage } from '../../lib/msg/errorMsg';
import toast from 'react-hot-toast';
import BannerSkeleton from '../../components/skeleton/BannerSkeleton';
import Pagination from '../../components/pagination/Pagination'; // Ensure paths match your repository file tree

type Category = {
    id: number;
    name: string;
    image: string;
    status: 'active' | 'inactive';
    created_at: string;
    updated_at: string;
};

export default function CategoryTable() {
    const [openModal, setOpenModal] = useState(false);

    // ========================================== Pagination Tracking States ==========================================
    const [page, setPage] = useState<number>(1);
    const [perPage, setPerPage] = useState<number>(5);

    // ============================================== All Category Api ==============================================
    // Passing the tracking keys dynamically updates RTK-Query cache indexes automatically
    const { data, isLoading, isFetching } = useAllCategoryQuery({
        page,
        per_page: perPage,
        include: 'foods'
    });

    const categoryData: Category[] = data?.data?.data || [];
    const lastPage = data?.data?.last_page || 1;
    const totalItems = data?.data?.total || 0;

    // =========================================== Category Upload And Update Related Function =======================================
    const [preview, setPreview] = useState<string>("");
    const [name, setName] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [editId, setEditId] = useState<number | null>(null);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const imageUrl = URL.createObjectURL(file);
            setPreview(imageUrl);
        }
    };

    const [openPopUpModal, setOpenPopUpModal] = useState(false);
    const handleOpenPopUpModal = () => {
        setOpenPopUpModal(true);
    };
    const handleClosePopUp = () => {
        setOpenPopUpModal(false);
    };

    const handleEdit = (banner: Category) => {
        setEditId(banner?.id);
        setName(banner?.name);
        setPreview(`${banner?.image}`);
        setImage(null);
        setOpenModal(true);
    };

    const handleCloseModal = async () => {
        setOpenModal(false);
        setPreview("");
        setName("");
        setEditId(null);
    };

    const [updateCateotgry, { isLoading: updateLoading }] = useUpdateCateotgryMutation();
    const [postCategory, { isLoading: postLoading }] = usePostCategoryMutation();

    const handleSubmit = async () => {
        if (editId) {
            const formData = new FormData();
            formData.append("name", name);
            if (image) {
                formData.append("image", image);
            }
            try {
                const res = await updateCateotgry({ editId, formData }).unwrap();
                if (res) {
                    setPreview("");
                    setName("");
                    handleClosePopUp();
                    toast.success(res?.message);
                    return setOpenModal(false);
                }
            } catch (error) {
                return errorMessage(error);
            }
        } else {
            const formData = new FormData();
            formData.append("name", name);
            if (image) {
                formData.append("image", image);
            }

            try {
                const res = await postCategory(formData).unwrap();
                if (res) {
                    setPreview("");
                    setName("");
                    handleClosePopUp();
                    toast.success(res?.message);
                    return setOpenModal(false);
                }
            } catch (error) {
                console.log(error);
                return errorMessage(error);
            }
        }
    };

    // ============================== Category Delete Api =====================================
    const [deleteCategory, { isLoading: deleteLoading }] = useDeleteCategoryMutation();
    const [deletePopUp, setDeletePopUp] = useState(false);
    const [deleteId, setDeletId] = useState<number>();

    const openDeletePopUp = (id: number) => {
        setDeletePopUp(true);
        setDeletId(id);
    };
    const closeDeletePopUp = () => {
        setDeletePopUp(false);
    };

    const handleDeleteCategory = async () => {
        try {
            const res = await deleteCategory(deleteId).unwrap();
            if (res) {
                toast.success(res?.message);
                return setDeletePopUp(false);
            }
        } catch (error) {
            return errorMessage(error);
        }
    };

    if (isLoading) {
        return (
            <div>
                <BannerSkeleton />
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-gray-50 p-6 md:p-10 rounded-2xl ">
                {/* HEADER */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold">Category Management</h1>
                            {isFetching && <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-700 animate-pulse">Syncing...</span>}
                        </div>
                        <p className="text-gray-500">Manage food categories</p>
                    </div>

                    <button
                        onClick={() => setOpenModal(true)}
                        className="flex items-center gap-2 bg-[#207F36] cursor-pointer text-white px-5 py-3 rounded-2xl font-semibold hover:opacity-90 transition-all"
                    >
                        <FiPlus />
                        Add Category
                    </button>
                </div>

                {/* TABLE */}
                <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
                    <div className="p-5 border-b font-semibold flex justify-between items-center">
                        <span>Category List ({totalItems})</span>
                        <span className="text-xs text-gray-400 font-normal">Showing page {page} of {lastPage}</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-175">
                            <thead className="bg-gray-50">
                                <tr className="text-sm text-gray-600 font-semibold">
                                    <th className="p-4 text-left">Category</th>
                                    <th className="p-4 text-left">Status</th>
                                    <th className="p-4 text-right">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {categoryData.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="p-10 text-center text-gray-400 text-sm">
                                            No categories found matching this scope filter.
                                        </td>
                                    </tr>
                                ) : (
                                    categoryData.map((cat) => (
                                        <tr key={cat.id} className="border-t hover:bg-gray-50/80 transition-colors">
                                            {/* CATEGORY */}
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={`${cat.image}`}
                                                        alt={cat.name}
                                                        className="w-12 h-12 rounded-xl object-cover border bg-gray-50"
                                                    />
                                                    <span className="font-semibold text-gray-800">{cat.name}</span>
                                                </div>
                                            </td>

                                            {/* STATUS */}
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${cat.status === 'active'
                                                        ? 'bg-green-100 text-green-600'
                                                        : 'bg-red-100 text-red-500'
                                                    }`}>
                                                    {cat.status}
                                                </span>
                                            </td>

                                            {/* ACTION */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-3">
                                                    {/* Edit */}
                                                    <button
                                                        onClick={() => handleEdit(cat)}
                                                        className="cursor-pointer w-10 h-10 rounded-lg bg-[#207F36] text-white flex items-center justify-center hover:bg-[#1a6a2d] duration-300"
                                                        title="Edit Category"
                                                    >
                                                        <FiEdit />
                                                    </button>

                                                    {/* Delete */}
                                                    <button
                                                        onClick={() => { openDeletePopUp(cat.id); }}
                                                        className="cursor-pointer w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 duration-300"
                                                        title="Delete Category"
                                                    >
                                                        <FiTrash2 />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* INTERNALLY LINKED PAGINATION WRAPPER */}
                    <Pagination
                        currentPage={page}
                        lastPage={lastPage}
                        totalResults={totalItems}
                        perPage={perPage}
                        isFetching={isFetching}
                        onPageChange={(targetPage) => setPage(targetPage)}
                        onPerPageChange={(newSize) => {
                            setPerPage(newSize);
                            setPage(1); // Drop index state backwards to clean up limits mismatch boundaries safely
                        }}
                    />
                </div>

                {/* MODAL */}
                {openModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                            {/* CLOSE */}
                            <button
                                onClick={handleCloseModal}
                                className="absolute top-4 right-4 cursor-pointer text-gray-400 hover:text-gray-700 transition-colors"
                            >
                                <FiX size={18} />
                            </button>

                            <h2 className="mb-4 text-xl font-bold text-gray-800">
                                {editId ? "Edit Category" : "Add Category"}
                            </h2>

                            <div className="flex flex-col gap-4">
                                {/* NAME */}
                                <input
                                    name="name"
                                    onChange={(e) => { setName(e.target.value); }}
                                    value={name}
                                    placeholder="Category name"
                                    className="w-full rounded-2xl border border-[#207F36] px-4 py-3 outline-none text-sm"
                                />

                                {/* BANNER IMAGE */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Banner Image
                                    </label>
                                    <input
                                        type="file"
                                        name="banner"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="w-full text-sm rounded-2xl border border-[#207F36] px-4 py-3 outline-none file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-[#207F36] file:px-4 file:py-2 file:text-white file:text-xs file:font-semibold"
                                    />
                                </div>

                                {/* Image Preview */}
                                {preview && (
                                    <div>
                                        <p className="mb-2 text-sm font-medium text-gray-700">Preview</p>
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className="w-full h-44 object-cover rounded-xl border"
                                        />
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleOpenPopUpModal}
                                className="mt-5 w-full rounded-xl bg-[#207F36] py-3 text-sm font-semibold text-white transition-all duration-300 hover:opacity-90 cursor-pointer"
                            >
                                {editId ? "Update Category" : "Add Category"}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* CONFIRMATION MODALS */}
            <ConfirmModal
                open={deletePopUp}
                title="Are you sure you want to delete?"
                description="Once deleted, this category cannot be recovered."
                confirmText={deleteLoading ? 'Deleting...' : "Delete"}
                cancelText="Cancel"
                onConfirm={handleDeleteCategory}
                onCancel={closeDeletePopUp}
                loading={deleteLoading}
            />

            <ConfirmModal
                open={openPopUpModal}
                title={editId ? "Are you sure you want to update this category?" : "Are you sure you want to upload this category?"}
                description={editId ? "The category information will be updated." : "The new category will be uploaded and visible to users."}
                confirmText={
                    (postLoading || updateLoading)
                        ? editId ? "Updating..." : "Uploading..."
                        : editId ? "Update" : "Upload"
                }
                cancelText="Cancel"
                onConfirm={handleSubmit}
                onCancel={handleClosePopUp}
                loading={postLoading || updateLoading}
            />
        </>
    );
}