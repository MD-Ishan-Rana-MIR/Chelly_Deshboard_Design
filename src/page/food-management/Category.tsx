
import { useState, type ChangeEvent } from 'react';
import { FiEdit, FiPlus, FiTrash2, FiX } from 'react-icons/fi';
import { useAllCategoryQuery, useDeleteCategoryMutation, usePostCategoryMutation, useUpdateCateotgryMutation } from '../../api/category/categoryApi';
import { imgUrl } from '../../lib/url/url';
import ConfirmModal from '../../lib/alert/ConfirmModal';
import { errorMessage } from '../../lib/msg/errorMsg';
import toast from 'react-hot-toast';
import BannerSkeleton from '../../components/skeleton/BannerSkeleton';

type Category = {
    id: number;
    name: string;
    image: string;
    status: 'active' | 'inactive';
    created_at: string;
    updated_at: string
};

export default function CategoryTable() {


    const [openModal, setOpenModal] = useState(false);






    // ============================================== All Category Api ==============================================

    const { data, isLoading } = useAllCategoryQuery(undefined);


    const categoryData: Category[] = data?.data?.data || [];


    // =========================================== Category Upload  And Update Related Function=======================================






    const [preview, setPreview] = useState<string>("");
    const [name, setName] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [editId, setEditId] = useState<number | null>(null);

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


    const [openPopUpModal, setOpenPopUpModal] = useState(false);

    const handleOpenPopUpModal = () => {
        setOpenPopUpModal(true)
    };

    const handleClosePopUp = () => {
        setOpenPopUpModal(false);
    };

    const handleEdit = (banner: Category) => {
        setEditId(banner?.id);
        setName(banner?.name);

        // image preview url
        setPreview(`${imgUrl}/${banner?.image}`);

        // reset file state
        setImage(null);

        setOpenModal(true);
    };


    const handleCloseModal = async () => {
        setOpenModal(false);
        setPreview("");
        setName("");
        setEditId(null);
    }

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
                    setName("")
                    handleClosePopUp()
                    toast.success(res?.message)
                    return setOpenModal(false)
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
                    setName("")
                    handleClosePopUp()
                    toast.success(res?.message)
                    return setOpenModal(false)
                }
            } catch (error) {
                console.log(error);
                return errorMessage(error);
            }
        }
    }

    // ============================== Cateogry Delete Api =====================================

    const [deleteCategory,{isLoading:deleteLoading}] = useDeleteCategoryMutation();

    const [deletePopUp,setDeletePopUp] = useState(false);

    const openDeletePopUp = (id:number)=>{
        setDeletePopUp(true);
        setDeletId(id)
    };
    
    const closeDeletePopUp = ()=>{
        setDeletePopUp(false)
    }

    const [deleteId,setDeletId] = useState<number>();


    const handleDeleteCategory = async ()=>{
        try {
            const res = await deleteCategory(deleteId).unwrap();
            if(res){
                toast.success(res?.message);
                return setDeletePopUp(false)
            }
        } catch (error) {
            return errorMessage(error);
        }
    }






    if (isLoading) {
        return (
            <div>
                <BannerSkeleton />
            </div>
        )
    }








    return (
        <>
            <div className="min-h-screen bg-gray-50 p-6 md:p-10 rounded-2xl ">

                {/* HEADER */}
                <div className="flex items-center justify-between mb-10">

                    <div>
                        <h1 className="text-3xl font-bold">
                            Category Management
                        </h1>
                        <p className="text-gray-500">
                            Manage food categories
                        </p>
                    </div>

                    <button
                        onClick={() => setOpenModal(true)}
                        className="flex items-center gap-2 bg-[#207F36] cursor-pointer text-white px-5 py-3 rounded-2xl font-semibold"
                    >
                        <FiPlus />
                        Add Category
                    </button>

                </div>

                {/* TABLE */}
                <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

                    <div className="p-5 border-b font-semibold">
                        Category List ({categoryData.length})
                    </div>

                    <table className="w-full min-w-175">

                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 text-left">Category</th>
                                <th className="p-4 text-left">Status</th>
                                <th className="p-4 text-right">Action</th>
                            </tr>
                        </thead>

                        <tbody>

                            {categoryData.map((cat) => (
                                <tr
                                    key={cat.id}
                                    className="border-t hover:bg-gray-50"
                                >

                                    {/* CATEGORY */}
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">

                                            <img
                                                src={`${imgUrl}/${cat.image}`}
                                                className="w-12 h-12 rounded-xl object-cover"
                                            />

                                            <span className="font-semibold">
                                                {cat.name}
                                            </span>

                                        </div>
                                    </td>

                                    {/* STATUS */}
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold
                                            ${cat.status === 'active'
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
                                                className=" cursor-pointer w-10 h-10 rounded-lg bg-[#207F36] text-white flex items-center justify-center hover:bg-[#1a6a2d] duration-300"
                                            >
                                                <FiEdit />
                                            </button>

                                            {/* Delete */}
                                            <button
                                                onClick={()=>{openDeletePopUp(cat.id)}}
                                                className=" cursor-pointer w-10 h-10 rounded-lg bg-red-100 text-red-600  flex items-center justify-center hover:bg-red-200 duration-300"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </td>

                                </tr>
                            ))}

                        </tbody>

                    </table>
                </div>

                {/* MODAL */}
                {openModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

                        <div className="relative w-[90%] max-w-md rounded-2xl bg-white p-6">

                            {/* CLOSE */}
                            <button
                                onClick={handleCloseModal}
                                className="absolute top-4 right-4 cursor-pointer"
                            >
                                <FiX />
                            </button>

                            <h2 className="mb-4 text-xl font-bold">
                                {editId ? "Edit Category" : "Add Category"}
                            </h2>

                            <div className="flex flex-col gap-4">

                                {/* NAME */}
                                <input
                                    name="name"
                                    onChange={(e) => { setName(e.target.value) }}
                                    value={name}
                                    placeholder="Category name"
                                    className="w-full rounded-2xl border border-[#207F36] px-4 py-3 outline-none focus:ring-0"
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

                                        className="w-full rounded-2xl border border-[#207F36] px-4 py-3 outline-none file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-[#207F36] file:px-4 file:py-2 file:text-white"
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


                            </div>

                            <button
                                onClick={handleOpenPopUpModal}
                                className="mt-4 w-full rounded-lg bg-[#207F36] py-3 text-white transition-all duration-300 hover:opacity-90 cursor-pointer "
                            >
                                {
                                    editId ? "Update Category" : "Add Category"
                                }
                            </button>

                        </div>

                    </div>
                )}
            </div>
            <ConfirmModal
                open={deletePopUp}
                title="Are you sure you want to sure delete?"
                description="Once deleted, this category cannot be recovered."
                confirmText={isLoading ? 'Deleting...' : "Delete"}
                cancelText="Cancel"
                onConfirm={handleDeleteCategory}
                onCancel={closeDeletePopUp}
                loading={deleteLoading}

            />

            {/* // For Post and Update  */}


            <ConfirmModal
                open={openPopUpModal}
                title={
                    editId
                        ? "Are you sure you want to update this cateogry?"
                        : "Are you sure you want to upload this cateogry?"
                }
                description={
                    editId
                        ? "The cateogry information will be updated."
                        : "The new cateogry will be uploaded and visible to users."
                }
                confirmText={
                    (postLoading || updateLoading)
                        ? editId
                            ? "Updating..."
                            : "Uploading..."
                        : editId
                            ? "Update"
                            : "Upload"
                }
                cancelText="Cancel"
                onConfirm={handleSubmit}
                onCancel={handleClosePopUp}
                loading={postLoading || updateLoading}
            />
        </>
    );
}