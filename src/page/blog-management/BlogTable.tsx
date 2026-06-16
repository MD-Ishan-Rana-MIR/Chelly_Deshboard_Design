import { useState } from 'react';
import { FiEdit, FiPlus, FiSearch, FiTrash2, FiX } from 'react-icons/fi';
import BlogUpload from './BlogUplod';
import { useAllBlogsQuery, useDeleteBlogMutation } from '../../api/blog/blogApi';
import type { BlogType } from '../../lib/type/type';
import ConfirmModal from '../../lib/alert/ConfirmModal';
import { errorMessage } from '../../lib/msg/errorMsg';
import toast from 'react-hot-toast';
import BlogEditModal from './BlogEditModal';
import Pagination from '../../components/pagination/Pagination'; // Adjust path based on your repository tree

export default function BlogPage() {
    const [openModal, setOpenModal] = useState(false);
    const [search, setSearch] = useState('');

    // ========================================= Pagination States =========================================
    const [page, setPage] = useState<number>(1);
    const [perPage, setPerPage] = useState<number>(10);

    // ========================================= All Blog API =========================================
    // Passing the query params directly to your slice mapping to support back-end processing
    const { data, isLoading, isFetching } = useAllBlogsQuery({
        page,
        per_page: perPage,
        include: 'category',
        search: search // Binds directly to filter[search] on your api slice
    });

    const blogData: BlogType[] = data?.data?.data || [];
    const currentPage = data?.data?.current_page || 1;
    const lastPage = data?.data?.last_page || 1;
    const totalItems = data?.data?.total || 0;

    // =============================================== Blog Delete related function and state ===============================================
    const [deleteBlog, { isLoading: deleteLoading }] = useDeleteBlogMutation();
    const [id, setId] = useState<number | null>(null);
    const [deletePopUp, setDeletePopUp] = useState(false);

    const handleDelete = (id: number) => {
        setId(id);
        setDeletePopUp(true);
    };

    const closeDeletePopUp = () => {
        setDeletePopUp(false);
        setId(null);
    };

    const handleDeleteCategory = async () => {
        try {
            const res = await deleteBlog(id!).unwrap();
            if (res) {
                setDeletePopUp(false);
                setId(null);
                return toast.success("Blog deleted successfully");
            }
        } catch (error) {
            return errorMessage(error);
        }
    };

    // ================================================ Edit Blog related function and state ================================================
    const [editId, setEditId] = useState<number | null>(null);
    const [openEditModal, setOpenEditModal] = useState(false);

    const handleEdit = (id: number) => {
        setEditId(id);
        setOpenEditModal(true);
    };

    return (
        <section className="min-h-screen bg-gray-50 p-6 md:p-10">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold">Blog Management</h1>
                        {isFetching && (
                            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 animate-pulse">
                                Syncing...
                            </span>
                        )}
                    </div>
                    <p className="text-gray-500">Create and manage blogs</p>
                </div>

                <button
                    onClick={() => setOpenModal(true)}
                    className="flex items-center gap-2 bg-[#207F36] cursor-pointer text-white px-5 py-3 rounded-2xl font-semibold hover:opacity-90 transition-opacity"
                >
                    <FiPlus />
                    Add Blog
                </button>
            </div>

            {/* SEARCH */}
            <div className="relative mb-6">
                <FiSearch className="absolute left-4 top-4 text-gray-400" />
                <input
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1); // Reset query index boundary safely back to 1 on input modifications
                    }}
                    placeholder="Search blog by title..."
                    className="w-full border border-[#207F36] focus:outline-0 focus:ring-0 pl-11 pr-4 py-3 rounded-2xl bg-white text-sm placeholder-gray-400"
                />
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-2xl shadow overflow-hidden">
                <div className="p-5 border-b font-semibold flex justify-between items-center text-gray-800">
                    <span>Articles ({totalItems})</span>
                    <span className="text-xs text-gray-400 font-normal">Page {currentPage} of {lastPage}</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 text-gray-600 text-sm border-b">
                            <tr>
                                <th className="p-4 text-left font-semibold">Title</th>
                                <th className="p-4 text-left font-semibold">Category</th>
                                <th className="p-4 text-right font-semibold">Action</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100 text-sm">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={3} className="p-8 text-center text-gray-400">
                                        Loading articles...
                                    </td>
                                </tr>
                            ) : blogData.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="p-8 text-center text-gray-400">
                                        No blogs found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                blogData.map((blog) => (
                                    <tr key={blog.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4 font-medium text-gray-800 max-w-md truncate" title={blog.title}>
                                            {blog.title}
                                        </td>

                                        <td className="p-4">
                                            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">
                                                {blog?.category?.name || 'Uncategorized'}
                                            </span>
                                        </td>

                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-3">
                                                <button
                                                    onClick={() => handleEdit(blog.id)}
                                                    className="cursor-pointer w-9 h-9 rounded-xl bg-[#207F36] text-white flex items-center justify-center hover:bg-[#1a6a2d] transition-all"
                                                    title="Edit Blog"
                                                >
                                                    <FiEdit size={16} />
                                                </button>
                                                
                                                <button
                                                    onClick={() => handleDelete(blog.id)}
                                                    className="cursor-pointer w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-all"
                                                    title="Delete Blog"
                                                >
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION PANEL */}
                {!isLoading && blogData.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        lastPage={lastPage}
                        totalResults={totalItems}
                        perPage={perPage}
                        isFetching={isFetching}
                        onPageChange={(targetPage) => setPage(targetPage)}
                        onPerPageChange={(newSize) => {
                            setPerPage(newSize);
                            setPage(1); // Drops index to safe boundaries if per-page metrics clip constraints
                        }}
                    />
                )}
            </div>

            {/* MODAL */}
            {openModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-[90%] max-w-2xl rounded-2xl p-6 relative shadow-2xl">
                        {/* CLOSE */}
                        <button
                            onClick={() => setOpenModal(false)}
                            className="absolute top-4 cursor-pointer right-4 text-gray-400 hover:text-gray-600"
                        >
                            <FiX size={22} />
                        </button>

                        <h2 className="text-xl font-bold mb-4 text-gray-800">
                            Create Blog
                        </h2>

                        {/* CHILD COMPONENT */}
                        <BlogUpload setOpenModal={setOpenModal} />
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {openEditModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-[90%] max-w-2xl rounded-2xl p-6 relative shadow-2xl">
                        {/* CLOSE */}
                        <button
                            onClick={() => setOpenEditModal(false)}
                            className="absolute top-4 cursor-pointer right-4 text-gray-400 hover:text-gray-600"
                        >
                            <FiX size={22} />
                        </button>

                        <h2 className="text-xl font-bold mb-4 text-gray-800">
                            Edit Blog
                        </h2>

                        {/* CHILD COMPONENT */}
                        <BlogEditModal editId={editId} setOpenEditModal={setOpenEditModal} />
                    </div>
                </div>
            )}

            {/* CONFIRM DELETE MODAL */}
            <ConfirmModal
                open={deletePopUp}
                title="Are you sure you want to delete?"
                description="Once deleted, this blog cannot be recovered."
                confirmText={deleteLoading ? 'Deleting...' : "Delete"}
                cancelText="Cancel"
                onConfirm={handleDeleteCategory}
                onCancel={closeDeletePopUp}
                loading={deleteLoading}
            />
        </section>
    );
}