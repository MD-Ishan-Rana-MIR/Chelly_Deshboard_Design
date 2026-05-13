'use client';

import { useState } from 'react';
import {
    FiPlus,
    FiUpload,
    FiX,
} from 'react-icons/fi';

type FoodItem = {
    id: number;
    name: string;
    category: string;
    price: number;
    stock: number;
    images: string[];
};

type FormType = {
    name: string;
    category: string;
    price: string;
    stock: string;
    images: string[];
    type : string;
};


export default function UploadFoodForm() {

    const [foods, setFoods] = useState<FoodItem[]>([]);

    console.log(foods)

    const [form, setForm] = useState<FormType>({
        name: '',
        category: '',
        price: '',
        stock: '',
        type : '',
        images: [],
    });

    // HANDLE INPUT
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // MULTIPLE IMAGE UPLOAD
    const handleImageUpload = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = e.target.files;

        if (!files) return;

        Array.from(files).forEach((file) => {

            const reader = new FileReader();

            reader.onloadend = () => {

                setForm((prev) => ({
                    ...prev,
                    images: [
                        ...prev.images,
                        reader.result as string,
                    ],
                }));

            };

            reader.readAsDataURL(file);

        });
    };

    // REMOVE IMAGE
    const removeImage = (index: number) => {

        const updatedImages = [...form.images];

        updatedImages.splice(index, 1);

        setForm((prev) => ({
            ...prev,
            images: updatedImages,
        }));
    };

    // ADD FOOD
    const handleAddFood = () => {

        if (
            !form.name ||
            !form.category ||
            !form.price ||
            !form.stock
        ) {
            alert('Please fill all fields');
            return;
        }

        const newFood: FoodItem = {
            id: Date.now(),
            name: form.name,
            category: form.category,
            price: Number(form.price),
            stock: Number(form.stock),
            images: form.images,
        };

        setFoods((prev) => [newFood, ...prev]);

        console.log(newFood);

        // RESET FORM
        setForm({
            name: '',
            category: '',
            price: '',
            stock: '',
            images: [],
            type: '',
        });
    };

    return (
        <div className=" p-6">



            {/* UPLOAD FORM */}
            <div className="bg-white rounded-3xl shadow-lg p-6 h-fit">

                {/* HEADER */}
                <div className="flex items-center gap-3 mb-6">

                    <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center">
                        <FiPlus size={22} />
                    </div>

                    <div>
                        <h2 className="text-xl font-bold">
                            Upload Food
                        </h2>

                        <p className="text-sm text-gray-500">
                            Add new food item
                        </p>
                    </div>

                </div>

                <div className="space-y-5">

                    {/* IMAGE */}
                    <div>

                        <label className="text-sm font-medium text-gray-600 block mb-2">
                            Food Images
                        </label>

                        <label className="border-2 border-dashed border-gray-300 rounded-2xl h-44 flex flex-col items-center justify-center cursor-pointer hover:border-green-500 transition bg-gray-50 overflow-hidden">

                            <FiUpload className="text-4xl text-gray-400 mb-2" />

                            <p className="text-sm text-gray-500">
                                Upload Multiple Images
                            </p>

                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                className="hidden"
                            />

                        </label>

                        {/* IMAGE PREVIEW */}
                        {form.images.length > 0 && (

                            <div className="grid grid-cols-3 gap-3 mt-4">

                                {form.images.map((img, index) => (

                                    <div
                                        key={index}
                                        className="relative h-24 rounded-xl overflow-hidden"
                                    >

                                        <img
                                            src={img}
                                            alt="preview"
                                            className="w-full h-full object-cover"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeImage(index)
                                            }
                                            className="absolute top-1 cursor-pointer right-1 bg-red-500 text-white rounded-full p-1"
                                        >
                                            <FiX size={14} />
                                        </button>

                                    </div>

                                ))}

                            </div>

                        )}

                    </div>

                    {/* NAME */}
                    <div>

                        <label className="text-sm font-medium text-gray-600 block mb-2">
                            Food Name
                        </label>

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

                        <label className="text-sm font-medium text-gray-600 block mb-2">
                            Category
                        </label>

                        <select
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            className="w-full border rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="">
                                Select Category
                            </option>

                            <option value="Burger">
                                Burger
                            </option>

                            <option value="Pizza">
                                Pizza
                            </option>

                            <option value="Pasta">
                                Pasta
                            </option>

                            <option value="Drinks">
                                Drinks
                            </option>

                        </select>

                    </div>

                    {/* PRICE */}
                    <div>

                        <label className="text-sm font-medium text-gray-600 block mb-2">
                            Price
                        </label>

                        <input
                            type="number"
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            placeholder="Food price"
                            className="w-full border rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                        />

                    </div>
                    {/* Food Type */}
                    <div>

                        <label className="text-sm font-medium text-gray-600 block mb-2">
                            Food Type
                        </label>

                        <input
                            type="text"
                            name="type"
                            value={form.type}
                            onChange={handleChange}
                            placeholder="Food type"
                            className="w-full border rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                        />

                    </div>

                    {/* STOCK */}
                    <div>

                        <label className="text-sm font-medium text-gray-600 block mb-2">
                            Stock
                        </label>

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
                        className="w-full btnColor cursor-pointer bg-[#207F36] hover:bg-green-700 text-white py-3 rounded-2xl font-semibold transition"
                    >
                        Upload Food
                    </button>

                </div>

            </div>



        </div>

    );
}