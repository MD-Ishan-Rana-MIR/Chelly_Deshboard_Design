

import { useState } from 'react';
import {
    FiPlus,
    FiUpload,
    FiX,
} from 'react-icons/fi';
import { useAllCategoryWithOutPaginationQuery } from '../../api/category/categoryApi';
import type { CategoryType } from '../blog-management/BlogEditModal';
import { useUploadFoodMutation } from '../../api/food/foodApi';
import toast from 'react-hot-toast';
import { errorMessage } from '../../lib/msg/errorMsg';

type FoodItem = {
    id: number;
    name: string;
    category: string;
    price: number;
    stock: number;
    image: File | null; // Changed from array to a single File or null
};

type FormType = {
    name: string;
    category: string;
    price: string;
    stock: string;
    image: File | null; // Track single File object instead of array
    type: string;
    description: string;
};

export default function FoodUpload() {


    // ============================================ Category Api ======================================================
    const { data } = useAllCategoryWithOutPaginationQuery({});
    const categoryData: CategoryType[] = data?.data?.data;

    const [foods, setFoods] = useState<FoodItem[]>([]);
    console.log("foods", foods);
    const [form, setForm] = useState<FormType>({
        name: '',
        category: '',
        price: '',
        stock: '',
        type: '',
        description: '',
        image: null, // Initialized as null for a single raw file
    });

    const [uploadFood, { isLoading }] = useUploadFoodMutation();

    // HANDLE INPUT
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // SINGLE RAW FILE UPLOAD (NO ARRAY, NO BASE64)
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        // Take only the first file selected
        setForm((prev) => ({
            ...prev,
            image: files[0],
        }));
    };

    // REMOVE SINGLE IMAGE
    const removeImage = () => {
        setForm((prev) => ({
            ...prev,
            image: null,
        }));
    };

    // ADD & UPLOAD FOOD
    const handleAddFood = async () => {
        // 1. Validation First
        if (!form.name || !form.category || !form.price || !form.stock) {
            alert('Please fill all required fields');
            return;
        }

        // 2. Prepare FormData payload for backend transmission
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('category_id', form.category);
        formData.append('description', form.description || '');
        formData.append('price', form.price);
        formData.append('stock', form.stock);
        formData.append('type', form.type);

        // Append the single native binary File chunk directly to FormData if it exists
        if (form.image) {
            formData.append('image', form.image);
        }

        try {
            // 3. Trigger the mutation API
            const res = await uploadFood(formData).unwrap();

            // 4. Update UI local state
            const newFood: FoodItem = {
                id: Date.now(),
                name: form.name,
                category: form.category,
                price: Number(form.price),
                stock: Number(form.stock),
                image: form.image,
            };
            setFoods((prev) => [newFood, ...prev]);

            // 5. RESET FORM
            setForm({
                name: '',
                category: '',
                price: '',
                stock: '',
                image: null,
                type: '',
                description: '',
            });

            return toast.success(res?.message || 'Food uploaded successfully!');
        } catch (error) {
            return errorMessage(error);
        }
    };

    return (
        <div className="p-6">
            <div className="bg-white rounded-3xl shadow-lg p-6 h-fit">

                {/* HEADER */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center">
                        <FiPlus size={22} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Upload Food</h2>
                        <p className="text-sm text-gray-500">Add new food item</p>
                    </div>
                </div>

                <div className="space-y-5">
                    {/* IMAGE */}
                    <div>
                        <label className="text-sm font-medium text-gray-600 block mb-2">Food Image</label>

                        {/* Only show upload dropzone if no image is selected */}
                        {!form.image ? (
                            <label className="border-2 border-dashed border-gray-300 rounded-2xl h-44 flex flex-col items-center justify-center cursor-pointer hover:border-green-500 transition bg-gray-50 overflow-hidden">
                                <FiUpload className="text-4xl text-gray-400 mb-2" />
                                <p className="text-sm text-gray-500">Upload Food Image</p>
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                            </label>
                        ) : (
                            /* SINGLE IMAGE PREVIEW USING OBJECT URL */
                            <div className="relative h-44 w-full rounded-2xl overflow-hidden border">
                                <img
                                    src={URL.createObjectURL(form.image)}
                                    alt="preview"
                                    className="w-full h-full object-cover"
                                    onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)} // Frees up browser memory leaks
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-3 cursor-pointer right-3 bg-red-500 text-white rounded-full p-1.5 shadow"
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

                    {/* CATEGORY */}
                    <div>
                        <label className="text-sm font-medium text-gray-600 block mb-2">Category</label>
                        <select
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            className="w-full border rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="">Select Category</option>
                            {categoryData && categoryData.map((category, index) => (
                                <option key={index} value={category?.id}>
                                    {category?.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* DESCRIPTION */}
                    <div>
                        <label className="text-sm font-medium text-gray-600 block mb-2">Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Enter food details or ingredients description..."
                            rows={3}
                            className="w-full border rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 resize-none"
                        />
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
                    {/* <div>
                        <label className="text-sm font-medium text-gray-600 block mb-2">Food Type</label>
                        <input
                            type="text"
                            name="type"
                            value={form.type}
                            onChange={handleChange}
                            placeholder="Food type (e.g. Spicy, Vegan)"
                            className="w-full border rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div> */}

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

                    {/* BUTTON */}
                    <button
                        onClick={handleAddFood}
                        disabled={isLoading}
                        className="w-full cursor-pointer bg-[#207F36] hover:bg-green-700 text-white py-3 rounded-2xl font-semibold transition disabled:opacity-50"
                    >

                        {isLoading ? 'Uploading...' : 'Upload Food'}
                    </button>
                </div>
            </div>
        </div>
    );
}