
import React, {

    useEffect,
    useState,
    type ChangeEvent,
} from "react";

import {
    FiPlus,
    FiEdit,
    FiTrash2,
    FiX,
} from "react-icons/fi";
import { useAllBannerQuery, useBannerDeleteMutation, useBannerUpdateMutation, useStoreBannerMutation } from "../../api/banner/bannerApi";
import ConfirmModal from "../../lib/alert/ConfirmModal";
import { errorMessage } from "../../lib/msg/errorMsg";
import toast from "react-hot-toast";
import BannerSkeleton from "../../components/skeleton/BannerSkeleton";
import { imgUrl } from './../../lib/url/url';

type Banner = {
    id: number;
    title: string;
    image: string;
    status: string;
    created_at: string;
    updated_at: string;
};

export default function BannerPage() {
    const [showModal, setShowModal] =
        useState<boolean>(false);

    const [banners, setBanners] = useState<Banner[]>([]);

    const [title, setTitle] = useState<string>("");

    const [image, setImage] = useState<File | null>(null);



    const [preview, setPreview] = useState<string>("");

    const [editId, setEditId] = useState<number | null>(null);

    const handleCloseModal = () => {
        setTitle("");
        setImage(null);
        setPreview("");
        setShowModal(false)

    }


    // =================================== Get All Banner Api ======================================


    const { data, isLoading: BannerLoading } = useAllBannerQuery(undefined);


    // eslint-disable-next-line react-hooks/exhaustive-deps
    const bannderData = data?.data?.data || [];

    useEffect(() => {
        setBanners(bannderData);
    }, [bannderData]);

    // Edit Banner
    const handleEdit = (banner: Banner) => {
        setEditId(banner.id);

        setTitle(banner.title);
        setPreview(`${imgUrl}/${banner.image}`);

        setShowModal(true);
    };



    // ======================= Banner Post api ============================

    const [storeBanner, { isLoading }] = useStoreBannerMutation();


    // ======================= Banner UPdate api ============================

    const [bannerUpdate, { isLoading: BannerUploadLoading }] = useBannerUpdateMutation();








    // Handle Image Upload
    const handleImageChange = (
        e: ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (file) {
            setImage(file);

            // Preview Image
            const imageUrl = URL.createObjectURL(file);
            setPreview(imageUrl);
        }
    };




    // =============================== Edit or Post Banner


    const handleSubmit = async () => {

        const formData = new FormData();

        formData.append("title", title);
        formData.append("status", "active");

        if (editId) {
            formData.append("_method", "PUT");
        }

        if (image) {
            formData.append("image", image);
        }

        try {

            // UPDATE
            if (editId) {

                const res = await bannerUpdate({
                    editId,
                    formData,
                }).unwrap();

                if (res) {
                    toast.success(res?.message || "Banner updated successfully");
                    setTitle("");
                    setPreview("");
                    setImage(null)
                    setShowModal(false);
                    return setOpenPopUpModal(false)
                }

            }

            // CREATE
            else {

                const res = await storeBanner(formData).unwrap();

                if (res) {
                    toast.success(res?.message || "Banner created successfully");
                    setOpenPopUpModal(false)
                    setTitle("");
                    setImage(null);
                    setPreview("");
                    return setShowModal(false);
                }


            }

            setShowModal(false);

        } catch (error) {
            errorMessage(error);
        }
    };



    // ============================================ Delete Banner Api ================================
    const [openPopUpModal, setOpenPopUpModal] = useState(false);
    const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);

    const handleLogoutCancel = () => {
        if (isLoading) return;
        setOpenPopUpModal(false);
        setSelectedDeleteId(null);
    };

    const [bannerDelete] = useBannerDeleteMutation();

    const [deletePopUp, setDeletePopUp] = useState(false);

    const handleDeleteClick = (id: number) => {
        setSelectedDeleteId(id);
        setDeletePopUp(true);
    };

    const deletePopUpClose = () => {
        setDeletePopUp(false)
    }

    const handleDelete = async () => {
        if (selectedDeleteId === null) return;

        try {
            const res = await bannerDelete(selectedDeleteId).unwrap();
            if (res) {
                setOpenPopUpModal(false);
                setSelectedDeleteId(null);
                setDeletePopUp(false)
                return toast.success(res?.message);
            }
        } catch (error) {
            errorMessage(error);
        }
    };

    const handlePopUpOpen = () => {
        setOpenPopUpModal(true);
    }



    if (BannerLoading) {
        return (
            <div>
                <BannerSkeleton></BannerSkeleton>
            </div>
        )
    }





    return (
        <div className="min-h-screen bg-gray-100 p-6 rounded-2xl ">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Banner Management
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Manage website banners
                    </p>
                </div>

                {/* Upload Button */}
                <button
                    onClick={() => { setShowModal(true); }}
                    className="flex items-center gap-2 bg-[#207F36] text-white px-5 py-3 rounded-xl hover:bg-[#1a6a2d] cursor-pointer duration-300"
                >
                    <FiPlus size={20} />
                    Upload Banner
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 text-black">
                            <tr>
                                <th className="px-6 py-4 text-left">
                                    #
                                </th>

                                <th className="px-6 py-4 text-left">
                                    Banner Image
                                </th>

                                <th className="px-6 py-4 text-left">
                                    Banner Name
                                </th>

                                <th className="px-6 py-4 text-center">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {banners.map((banner, index) => (
                                <tr
                                    key={banner.id}
                                    className="border-b hover:bg-gray-50 duration-200"
                                >
                                    <td className="px-6 py-4">
                                        {index + 1}
                                    </td>

                                    <td className="px-6 py-4">
                                        <img
                                            src={`${imgUrl}/${banner.image}`}
                                            alt={banner.title}
                                            className="w-32 h-16 object-cover rounded-lg border"
                                        />
                                    </td>

                                    <td className="px-6 py-4 font-semibold text-gray-700">
                                        {banner.title}
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-3">
                                            {/* Edit */}
                                            <button
                                                onClick={() => handleEdit(banner)}
                                                className=" cursor-pointer w-10 h-10 rounded-lg bg-[#207F36] text-white flex items-center justify-center hover:bg-[#1a6a2d] duration-300"
                                            >
                                                <FiEdit />
                                            </button>

                                            {/* Delete */}
                                            <button
                                                onClick={() =>
                                                    handleDeleteClick(banner?.id)
                                                }
                                                className=" cursor-pointer w-10 h-10 rounded-lg bg-red-100 text-red-600  flex items-center justify-center hover:bg-red-200 duration-300"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {banners.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="text-center py-10 text-gray-500"
                                    >
                                        No Banner Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-lg rounded-2xl p-6 relative">
                        {/* Close */}
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-4 cursor-pointer right-4 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
                        >
                            <FiX />
                        </button>

                        {/* Title */}
                        <h2 className="text-2xl font-bold mb-6">
                            {editId
                                ? "Update Banner"
                                : "Upload Banner"}
                        </h2>

                        {/* Form */}
                        <div
                            className="space-y-5"
                        >
                            {/* Banner Name */}
                            <div>
                                <label className="block mb-2 font-medium text-gray-700">
                                    Banner Name
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter banner title"
                                    value={title}
                                    onChange={(e) =>
                                        setTitle(e.target.value)
                                    }
                                    className="w-full border border-[#207F36] rounded-xl px-4 py-3 focus:outline-none focus:ring-0 focus:ring-[#207F36]"
                                />
                            </div>

                            {/* Upload Image */}
                            <div>
                                <label className="block mb-2 font-medium text-gray-700">
                                    Upload Banner Image
                                </label>

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full border border-[#207F36] rounded-xl px-4 py-3"
                                />
                            </div>

                            {/* Image Preview */}
                            {preview && (
                                <div>
                                    <p className="mb-2 font-medium text-gray-700">
                                        Preview
                                    </p>

                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="w-full h-52 object-cover rounded-xl border"
                                    />
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                onClick={handlePopUpOpen}
                                type="submit"
                                className="w-full bg-[#207F36] text-white py-3 rounded-xl hover:bg-[#1a6a2d] cursor-pointer duration-300 font-semibold"
                            >
                                Upload
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal
                open={deletePopUp}
                title="Are you sure you want to sure delete?"
                description="Once deleted, this banner cannot be recovered."
                confirmText={isLoading ? 'Deleting...' : "Delete"}
                cancelText="Cancel"
                onConfirm={handleDelete}
                onCancel={deletePopUpClose}
            />

            {/* // For Post and Update  */}


            <ConfirmModal
                open={openPopUpModal}
                title={
                    editId
                        ? "Are you sure you want to update this banner?"
                        : "Are you sure you want to upload this banner?"
                }
                description={
                    editId
                        ? "The banner information will be updated."
                        : "The new banner will be uploaded and visible to users."
                }
                confirmText={
                    isLoading
                        ? editId
                            ? "Updating..."
                            : "Uploading..."
                        : editId
                            ? "Update"
                            : "Upload"
                }
                cancelText="Cancel"
                onConfirm={handleSubmit}
                onCancel={handleLogoutCancel}
            />







        </div>
    );
}

import  {

    useState,
    type ChangeEvent,
    type FormEvent,
} from "react";

import {
    FiPlus,
    FiEdit,
    FiTrash2,
    FiX,
} from "react-icons/fi";

type Banner = {
    id: number;
    title: string;
    image: string;
};

export default function BannerPage() {
    const [showModal, setShowModal] =
        useState<boolean>(false);

    const [banners, setBanners] = useState<Banner[]>([]);

    const [title, setTitle] = useState<string>("");

    const [image, setImage] = useState<File | null>(null);

    console.log(image);

    const [preview, setPreview] = useState<string>("");

    const [editId, setEditId] = useState<number | null>(
        null
    );

    // Handle Image Upload
    const handleImageChange = (
        e: ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (file) {
            setImage(file);

            // Preview Image
            const imageUrl = URL.createObjectURL(file);
            setPreview(imageUrl);
        }
    };

    // Add / Update Banner
    const handleSubmit = (
        e: FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!title || !preview) {
            alert("Please fill all fields");
            return;
        }

        if (editId) {
            // Update Banner
            const updatedBanner = banners.map((banner) =>
                banner.id === editId
                    ? {
                        ...banner,
                        title,
                        image: preview,
                    }
                    : banner
            );

            setBanners(updatedBanner);
            setEditId(null);
        } else {
            // Add Banner
            const newBanner: Banner = {
                id: Date.now(),
                title,
                image: preview,
            };

            setBanners([...banners, newBanner]);
        }

        // Reset
        setTitle("");
        setImage(null);
        setPreview("");
        setShowModal(false);
    };

    // Delete Banner
    const handleDelete = (id: number) => {
        const filtered = banners.filter(
            (banner) => banner.id !== id
        );

        setBanners(filtered);
    };

    // Edit Banner
    const handleEdit = (banner: Banner) => {
        setEditId(banner.id);

        setTitle(banner.title);
        setPreview(banner.image);

        setShowModal(true);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Banner Management
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Manage website banners
                    </p>
                </div>

                {/* Upload Button */}
                <button
                    onClick={() => {
                        setShowModal(true);

                        setEditId(null);
                        setTitle("");
                        setImage(null);
                        setPreview("");
                    }}
                    className="flex items-center gap-2 bg-[#207F36] text-white px-5 py-3 rounded-xl hover:bg-[#1a6a2d] cursor-pointer duration-300"
                >
                    <FiPlus size={20} />
                    Upload Banner
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 text-black">
                            <tr>
                                <th className="px-6 py-4 text-left">
                                    #
                                </th>

                                <th className="px-6 py-4 text-left">
                                    Banner Image
                                </th>

                                <th className="px-6 py-4 text-left">
                                    Banner Name
                                </th>

                                <th className="px-6 py-4 text-center">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {banners.map((banner, index) => (
                                <tr
                                    key={banner.id}
                                    className="border-b hover:bg-gray-50 duration-200"
                                >
                                    <td className="px-6 py-4">
                                        {index + 1}
                                    </td>

                                    <td className="px-6 py-4">
                                        <img
                                            src={banner.image}
                                            alt={banner.title}
                                            className="w-32 h-16 object-cover rounded-lg border"
                                        />
                                    </td>

                                    <td className="px-6 py-4 font-semibold text-gray-700">
                                        {banner.title}
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-3">
                                            {/* Edit */}
                                            <button
                                                onClick={() => handleEdit(banner)}
                                                className=" cursor-pointer w-10 h-10 rounded-lg bg-[#207F36] text-white flex items-center justify-center hover:bg-[#1a6a2d] duration-300"
                                            >
                                                <FiEdit />
                                            </button>

                                            {/* Delete */}
                                            <button
                                                onClick={() =>
                                                    handleDelete(banner.id)
                                                }
                                                className=" cursor-pointer w-10 h-10 rounded-lg bg-red-100 text-red-600  flex items-center justify-center hover:bg-red-200 duration-300"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {banners.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="text-center py-10 text-gray-500"
                                    >
                                        No Banner Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-lg rounded-2xl p-6 relative">
                        {/* Close */}
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 cursor-pointer right-4 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
                        >
                            <FiX />
                        </button>

                        {/* Title */}
                        <h2 className="text-2xl font-bold mb-6">
                            {editId
                                ? "Update Banner"
                                : "Upload Banner"}
                        </h2>

                        {/* Form */}
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >
                            {/* Banner Name */}
                            <div>
                                <label className="block mb-2 font-medium text-gray-700">
                                    Banner Name
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter banner title"
                                    value={title}
                                    onChange={(e) =>
                                        setTitle(e.target.value)
                                    }
                                    className="w-full border border-[#207F36] rounded-xl px-4 py-3 focus:outline-none focus:ring-0 focus:ring-[#207F36]"
                                />
                            </div>

                            {/* Upload Image */}
                            <div>
                                <label className="block mb-2 font-medium text-gray-700">
                                    Upload Banner Image
                                </label>

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full border border-[#207F36] rounded-xl px-4 py-3"
                                />
                            </div>

                            {/* Image Preview */}
                            {preview && (
                                <div>
                                    <p className="mb-2 font-medium text-gray-700">
                                        Preview
                                    </p>

                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="w-full h-52 object-cover rounded-xl border"
                                    />
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                className="w-full bg-[#207F36] text-white py-3 rounded-xl hover:bg-[#1a6a2d] cursor-pointer duration-300 font-semibold"
                            >
                                {editId
                                    ? "Update Banner"
                                    : "Upload Banner"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}