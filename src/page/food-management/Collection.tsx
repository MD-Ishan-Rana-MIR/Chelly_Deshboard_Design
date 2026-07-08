import React, { useState } from 'react';
import { FiPlus, FiX, FiEdit, FiTrash2 } from 'react-icons/fi';
import { useCreateCollectionMutation, useDeleteCollectionMutation, useGetAllCollectionQuery, useUpdateCollectionMutation, } from '../../api/collection/collectionApi';
import type { CollectionItem } from '../../lib/type/type';
import toast from 'react-hot-toast';



const Collection = () => {
    // --- UI State Management ---
    const [showModal, setShowModal] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('');
    const [editId, setEditId] = useState<number | null>(null);

    // Deletion Modal Tracking
    const [deletePopUp, setDeletePopUp] = useState<boolean>(false);
    const [targetDeleteId, setTargetDeleteId] = useState<number | null>(null);

    // --- RTK Query Hooks ---
    const { data, isLoading: dataLoading, refetch } = useGetAllCollectionQuery({});
    const [createCollection, { isLoading: isCreating }] = useCreateCollectionMutation();
    const [updateCollection, { isLoading: isUpdating }] = useUpdateCollectionMutation();
    const [deleteCollection, { isLoading: isDeleting }] = useDeleteCollectionMutation();

    const collectionData: CollectionItem[] = data?.data || [];




    const handleCloseModal = () => {
        setShowModal(false);
        setTitle('');
        setEditId(null);
    };

    const handleEditInitiate = (collection: CollectionItem) => {
        setEditId(collection.id);
        setTitle(collection?.name);
        setShowModal(true);
    };

    const handleDeleteInitiate = (id: number) => {
        setTargetDeleteId(id);
        setDeletePopUp(true);
    };

    // --- API Mutation Executors ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return alert("Collection title is required");

        // FormData structure for multi-part file uploads
        const payload = new FormData();
        payload.append('name', title);


        try {
            if (editId) {
                const res = await updateCollection({ id: editId, data: payload }).unwrap();
                if (res) {
                    setShowModal(false);
                    setTitle('');
                    setEditId(null);
                    return toast.success(res?.message)
                }
            } else {
                const res = await createCollection(payload).unwrap();
                if (res) {
                    setShowModal(false);
                    setTitle('');
                    setEditId(null);
                    return toast.success(res?.message)
                }
            }
            handleCloseModal();
            refetch();
        } catch (error) {
            console.error("Mutation failed:", error);
        }
    };

    const handleConfirmDelete = async () => {
        if (!targetDeleteId) return;
        try {
            const res = await deleteCollection(targetDeleteId).unwrap();
            setDeletePopUp(false);
            setTargetDeleteId(null);
            refetch();
            return toast.success(res?.message)
        } catch (error) {
            console.error("Deletion failed:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6 rounded-2xl">
            {/* Header Block */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Collection Management
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Organize and customize user collections
                    </p>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-[#207F36] text-white px-5 py-3 rounded-xl hover:bg-[#1a6a2d] cursor-pointer duration-300 font-medium"
                >
                    <FiPlus size={20} />
                    Add Collection
                </button>
            </div>

            {/* Data Representation Table */}
            <div className="bg-white rounded-2xl shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 text-black">
                            <tr>
                                <th className="px-6 py-4 text-left w-16">#</th>
                                <th className="px-6 py-4 text-left">Collection Name</th>
                                <th className="px-6 py-4 text-center w-32">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {dataLoading ? (
                                <tr>
                                    <td colSpan={4} className="text-center py-10 text-gray-500">
                                        Fetching active collections...
                                    </td>
                                </tr>
                            ) : collectionData.map((collection, index) => (
                                <tr
                                    key={collection.id}
                                    className="border-b hover:bg-gray-50 duration-200"
                                >
                                    <td className="px-6 py-4">{index + 1}</td>

                                    <td className="px-6 py-4 font-semibold text-gray-700">
                                        {collection.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-3">
                                            <button
                                                onClick={() => handleEditInitiate(collection)}
                                                className="cursor-pointer w-9 h-9 rounded-lg bg-[#207F36] text-white flex items-center justify-center hover:bg-[#1a6a2d] duration-300"
                                                title="Edit Collection"
                                            >
                                                <FiEdit size={16} />
                                            </button>

                                            <button
                                                onClick={() => handleDeleteInitiate(collection.id)}
                                                className="cursor-pointer w-9 h-9 rounded-lg bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 duration-300"
                                                title="Delete Collection"
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {!dataLoading && collectionData.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-10 text-gray-500">
                                        No collections found. Click "Add Collection" to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Creation / Modification Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-lg rounded-2xl p-6 relative">
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 cursor-pointer duration-200"
                        >
                            <FiX />
                        </button>

                        <h2 className="text-2xl font-bold mb-6">
                            {editId ? "Update Collection" : "Create New Collection"}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block mb-2 font-medium text-gray-700">
                                    Collection Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Summer Essentials"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full border border-gray-300 focus:border-[#207F36] rounded-xl px-4 py-3 focus:outline-none transition-all"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isCreating || isUpdating}
                                className="w-full bg-[#207F36] text-white py-3 rounded-xl hover:bg-[#1a6a2d] disabled:bg-gray-400 cursor-pointer duration-300 font-semibold text-center"
                            >
                                {isCreating || isUpdating ? "Saving..." : editId ? "Save Changes" : "Create Collection"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Persistent Delete Confirmation Overlay */}
            {deletePopUp && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-md rounded-2xl p-6 text-center shadow-lg">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Collection?</h3>
                        <p className="text-gray-500 mb-6 text-sm">
                            This action cannot be undone. All items attached to this collection will be cataloged as unassigned.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setDeletePopUp(false)}
                                className="w-1/2 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 font-medium cursor-pointer duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                disabled={isDeleting}
                                className="w-1/2 bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 font-medium cursor-pointer duration-200"
                            >
                                {isDeleting ? "Removing..." : "Confirm Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Collection;