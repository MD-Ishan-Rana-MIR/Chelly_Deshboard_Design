/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { FiUpload, FiX } from 'react-icons/fi';
import { MdEdit } from 'react-icons/md';
import { useAllCategoryWithOutPaginationQuery } from '../../api/category/categoryApi';
import type { CategoryType } from '../../page/blog-management/BlogEditModal';
import toast from 'react-hot-toast';
import { errorMessage } from '../../lib/msg/errorMsg';
import { useFoodUpdateMutation } from '../../api/food/foodApi';

// Standard React imports for the WYSIWYG Editor
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

type FormType = {
    id: string;
    name: string;
    category: string;
    price: string;
    stock: string;
    image: File | string | null;
    type: string;
    description: string;
};

interface EditFormProps {
    setOpenEditModal: (open: boolean) => void;
    editData: any | null; // Set to any to handle flexible backend formats smoothly
}

// Configuration toolbar options for the HTML editor
const quillModules = {
    toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['clean']
    ],
};

const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'blockquote',
    'list', 'bullet'
];

export default function EditForm({ setOpenEditModal, editData }: EditFormProps) {
    // ============================================ Category Api ======================================================
    const { data } = useAllCategoryWithOutPaginationQuery({});
    const categoryData: CategoryType[] = data?.data?.data;

    console.log("editData", editData);

    const [form, setForm] = useState<FormType>({
        id: '',
        name: '',
        category: '',
        price: '',
        stock: '',
        type: '',
        description: '',
        image: null,
    });

    const [foodUpdate, { isLoading }] = useFoodUpdateMutation();

    // POPULATE FORM WITH DEFAULT VALUES WHEN editData ARRIVES
    useEffect(() => {
        if (editData) {
            // Checks for direct fields, nested object '_id', or nested object 'id'
            const currentCategoryId =
                editData.category_id ||
                editData.category?._id ||
                editData.category?.id ||
                (typeof editData.category === 'string' ? editData.category : '');

            setForm({
                id: String(editData._id || editData.id || ''),
                name: editData.name || '',
                category: String(currentCategoryId), // This string matches the value inside <option value="...">
                price: editData.price ? String(editData.price) : '',
                stock: editData.stock ? String(editData.stock) : '',
                type: editData.type || '',
                description: editData.description || '',
                image: editData.image || null,
            });
        }
    }, [editData]);

    // HANDLE TEXT INPUT CHANGES
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // HANDLE RICH TEXT EDITOR CHANGES
    const handleDescriptionChange = (content: string) => {
        setForm((prev) => ({
            ...prev,
            description: content
        }));
    };

    // FILE UPLOAD HANDLER
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setForm((prev) => ({
            ...prev,
            image: files[0],
        }));
    };

    // REMOVE IMAGE
    const removeImage = () => {
        setForm((prev) => ({
            ...prev,
            image: null,
        }));
    };

    // SUBMIT UPDATE REQUEST
    const handleUpdateFood = async () => {
        if (!form.name || !form.category || !form.price || !form.stock) {
            toast.error('Please fill all required fields');
            return;
        }

        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('category_id', form.category); // Sends selected category string _id to payload
        formData.append('description', form.description || '');
        formData.append('price', form.price);
        formData.append('stock', form.stock);
        formData.append('type', form.type);

        if (form.image instanceof File) {
            formData.append('image', form.image);
        }

        const recordId = form.id || editData?._id || editData?.id;

        try {
            await foodUpdate({ id: recordId,formData }).unwrap();
            toast.success('Food item updated successfully!');
            setOpenEditModal(false);
            return;
        } catch (error) {
            console.log(error)
            errorMessage(error);
        }
    };

    const getImagePreviewSrc = () => {
        if (!form.image) return '';
        if (form.image instanceof File) {
            return URL.createObjectURL(form.image);
        }
        return form.image;
    };

    return (
        <div className="p-6">
            <div className="bg-white rounded-3xl shadow-lg p-6 h-fit">

                {/* HEADER */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
                        <MdEdit size={22} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Update Food Details</h2>
                        <p className="text-sm text-gray-500">Modify existing product configurations</p>
                    </div>
                </div>

                <div className="space-y-5">
                    {/* IMAGE SECTION */}
                    <div>
                        <label className="text-sm font-medium text-gray-600 block mb-2">Food Image</label>

                        {!form.image ? (
                            <label className="border-2 border-dashed border-gray-300 rounded-2xl h-44 flex flex-col items-center justify-center cursor-pointer hover:border-green-500 transition bg-gray-50 overflow-hidden">
                                <FiUpload className="text-4xl text-gray-400 mb-2" />
                                <p className="text-sm text-gray-500">Upload Food Image</p>
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                            </label>
                        ) : (
                            <div className="relative h-44 w-full rounded-2xl overflow-hidden border group">
                                <img
                                    src={getImagePreviewSrc()}
                                    alt="preview"
                                    className="w-full h-full object-cover"
                                    onLoad={(e) => {
                                        if (form.image instanceof File) {
                                            URL.revokeObjectURL((e.target as HTMLImageElement).src);
                                        }
                                    }}
                                />

                                <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white cursor-pointer">
                                    <FiUpload className="text-2xl mb-1" />
                                    <span className="text-xs font-medium">Change Image</span>
                                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                </label>

                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-3 right-3 z-10 bg-red-500 text-white rounded-full p-1.5 shadow hover:bg-red-600 transition cursor-pointer"
                                >
                                    <FiX size={18} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* NAME */}
                    <div>
                        <label className="text-sm font-medium text-gray-600 block mb-2">Food Name</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Food name"
                            className="w-full border rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    {/* CATEGORY SELECT DROPDOWN */}
                    <div>
                        <label className="text-sm font-medium text-gray-600 block mb-2">Category</label>
                        <select
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            className="w-full border rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="">Select Category</option>
                            {categoryData?.map((category: any, index) => {
                                const catId = category?._id || category?.id;
                                return (
                                    <option key={index} value={String(catId)}>
                                        {category?.name}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    {/* DESCRIPTION (HTML RICH TEXT EDITOR) */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 block mb-2">Description</label>
                        <div className="[&&_.ql-toolbar]:rounded-t-2xl [&&_.ql-toolbar]:border-gray-200 [&&_.ql-container]:rounded-b-2xl [&&_.ql-container]:border-gray-200 [&&_.ql-container]:min-h-[150px] [&&_.ql-editor]:text-base">
                            <ReactQuill
                                theme="snow"
                                value={form.description}
                                onChange={handleDescriptionChange}
                                modules={quillModules}
                                formats={quillFormats}
                                placeholder="Enter structural product data or recipes..."
                            />
                        </div>
                    </div>

                    {/* PRICE */}
                    <div>
                        <label className="text-sm font-medium text-gray-600 block mb-2">Price</label>
                        <input
                            type="number"
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            placeholder="Food price"
                            className="w-full border rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    {/* FOOD TYPE */}
                    <div>
                        <label className="text-sm font-medium text-gray-600 block mb-2">Food Type</label>
                        <input
                            type="text"
                            name="type"
                            value={form.type}
                            onChange={handleChange}
                            placeholder="Food type (e.g. Spicy, Vegan)"
                            className="w-full border rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    {/* STOCK */}
                    <div>
                        <label className="text-sm font-medium text-gray-600 block mb-2">Stock</label>
                        <input
                            type="number"
                            name="stock"
                            value={form.stock}
                            onChange={handleChange}
                            placeholder="Available stock"
                            className="w-full border rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    {/* SAVE BUTTON */}
                    <button
                        onClick={handleUpdateFood}
                        disabled={isLoading}
                        className="w-full cursor-pointer bg-[#207F36] hover:bg-green-700 text-white py-3 rounded-2xl font-semibold transition disabled:opacity-50"
                    >
                        {isLoading ? 'Saving Changes...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}