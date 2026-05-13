'use client';

import { useMemo, useState } from 'react';
import { FiPlus, FiTrash2, FiX } from 'react-icons/fi';

type Category = {
    id: number;
    name: string;
    image: string;
    status: 'Active' | 'Inactive';
};

export default function CategoryTable() {

    const [categories, setCategories] = useState<Category[]>([
        {
            id: 1,
            name: 'Burger',
            image: 'https://images.unsplash.com/photo-1550547660-d9450f859349',
            status: 'Active',
        },
        {
            id: 2,
            name: 'Pizza',
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
            status: 'Active',
        },
    ]);

    const [openModal, setOpenModal] = useState(false);

    const [form, setForm] = useState({
        name: '',
        image: '',
        status: 'Active',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

   

    const handleAddCategory = () => {
        const newCategory: Category = {
            id: Date.now(),
            name: form.name,
            image: form.image,
            status: form.status as 'Active' | 'Inactive',
        };

        setCategories((prev) => [newCategory, ...prev]);

        setForm({
            name: '',
            image: '',
            status: 'Active',
        });

        setOpenModal(false);
    };

    const handleDelete = (id: number) => {
        setCategories(categories.filter((c) => c.id !== id));
    };

    const filtered = useMemo(() => categories, [categories]);

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10">

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
                    Category List ({categories.length})
                </div>

                <table className="w-full min-w-[700px]">

                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-4 text-left">Category</th>
                            <th className="p-4 text-left">Status</th>
                            <th className="p-4 text-right">Action</th>
                        </tr>
                    </thead>

                    <tbody>

                        {filtered.map((cat) => (
                            <tr
                                key={cat.id}
                                className="border-t hover:bg-gray-50"
                            >

                                {/* CATEGORY */}
                                <td className="p-4">
                                    <div className="flex items-center gap-3">

                                        <img
                                            src={cat.image}
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
                                            ${cat.status === 'Active'
                                            ? 'bg-green-100 text-green-600'
                                            : 'bg-red-100 text-red-500'
                                        }`}>
                                        {cat.status}
                                    </span>
                                </td>

                                {/* ACTION */}
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => handleDelete(cat.id)}
                                        className="w-9 h-9 rounded-xl mx-auto text-center cursor-pointer bg-red-50 text-red-500"
                                    >
                                        <FiTrash2 className=' text-center ml-2.5'  />
                                    </button>
                                </td>

                            </tr>
                        ))}

                    </tbody>

                </table>
            </div>

            {/* MODAL */}
            {openModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

                    <div className="bg-white w-[90%] max-w-md rounded-2xl p-6 relative">

                        {/* CLOSE */}
                        <button
                            onClick={() => setOpenModal(false)}
                            className="cursor-pointer absolute top-4 right-4"
                        >
                            <FiX />
                        </button>

                        <h2 className="text-xl font-bold mb-4 cursor-pointer ">
                            Add Category
                        </h2>



                        <div className="flex flex-col gap-4">
                            {/* NAME */}
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Category name"
                                className="w-full border border-[#207F36] rounded-2xl px-4 py-3 outline-none focus:ring-0 "
                            />

                            {/* STATUS */}
                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className="w-full border border-[#207F36] rounded-2xl px-4 py-3 outline-none focus:ring-0 "
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>

                        <button
                            onClick={handleAddCategory}
                            className="w-full bg-[#207F36] cursor-pointer text-white py-2 rounded-lg mt-4"
                        >
                            Add Category
                        </button>

                    </div>

                </div>
            )}

        </div>
    );
}