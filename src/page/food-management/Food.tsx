'use client';

import { useMemo, useState } from 'react';
import { FiDownload,FiTrash2, FiX, FiPlus } from 'react-icons/fi';
import UploadFoodForm from '../../components/ui/FoodUpload';

type FoodItem = {
    id: number;
    name: string;
    category: string;
    price: number;
    stock: number;
    status: string;
    image: string;
};

export default function Food() {

    const [foods, setFoods] = useState<FoodItem[]>([
        {
            id: 1,
            name: 'Classic Burger',
            category: 'Burger',
            price: 12,
            stock: 25,
            status: 'Available',
            image:
                'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
        },
        {
            id: 2,
            name: 'Chicken Pizza',
            category: 'Pizza',
            price: 18,
            stock: 12,
            status: 'Available',
            image:
                'https://images.unsplash.com/photo-1513104890138-7c749659a591',
        },
    ]);

    // FORM STATE


    // MODAL STATE
    const [openModal, setOpenModal] = useState(false);

    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');



   

    // DELETE
    const handleDelete = (id: number) => {
        setFoods(foods.filter((f) => f.id !== id));
    };

    // FILTER
    const filteredFoods = useMemo(() => {
        return foods.filter((food) => {
            const matchSearch = food.name
                .toLowerCase()
                .includes(search.toLowerCase());

            const matchCategory =
                categoryFilter === 'All'
                    ? true
                    : food.category === categoryFilter;

            return matchSearch && matchCategory;
        });
    }, [foods, search, categoryFilter]);


    // EXPORT CSV
const handleExportCSV = () => {
    const headers = ["ID", "Name", "Category", "Price", "Stock", "Status"];

    const rows = filteredFoods.map((food) => [
        food.id,
        food.name,
        food.category,
        food.price,
        food.stock,
        food.status,
    ]);

    const csvContent =
        [headers, ...rows]
            .map((row) => row.join(","))
            .join("\n");

    const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "foods.csv");

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};


    return (
        <>
            
            <section className="min-h-screen bg-gray-50 p-6 md:p-10">

                {/* HEADER */}
                <div className="flex items-center justify-between mb-10">

                    <div>
                        <h1 className="text-3xl font-bold">
                            Food Management
                        </h1>
                        <p className="text-gray-500">
                            Manage your food items
                        </p>
                    </div>

                    <div className="flex gap-3">

                        <button
                            onClick={() => setOpenModal(true)}
                            className="flex items-center gap-2 bg-[#207F36]  cursor-pointer text-white px-5 py-3 rounded-2xl font-semibold"
                        >
                            <FiPlus />
                            Add Food
                        </button>

                        <button onClick={handleExportCSV} className="flex items-center gap-2 cursor-pointer bg-[#207F36] text-white px-5 py-3 rounded-2xl font-semibold">
                            <FiDownload />
                            Export
                        </button>

                    </div>

                </div>

                {/* FILTER */}
                <div className="flex gap-4 mb-6">

                    <input
                        className="border px-4 py-3 border-[#207F36] hover:ring-0 focus:outline-0 focus:ring-0  rounded-xl w-full"
                        placeholder="Search food..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <select
                        className="border px-4 py-3 border-[#207F36] hover:ring-0 focus:outline-0 focus:ring-0  rounded-xl"
                        onChange={(e) =>
                            setCategoryFilter(e.target.value)
                        }
                    >
                        <option value="All">All</option>
                        <option value="Burger">Burger</option>
                        <option value="Pizza">Pizza</option>
                    </select>

                </div>

                {/* TABLE */}
                <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

                    {/* TABLE HEADER */}
                    <div className="p-5 border-b flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Food List
                        </h2>

                        <span className="text-sm text-gray-500">
                            Total: {filteredFoods.length}
                        </span>
                    </div>

                    {/* TABLE */}
                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[900px]">

                            <thead className="bg-gray-50">
                                <tr className="text-left text-sm text-gray-600">
                                    <th className="p-4 font-semibold">Food</th>
                                    <th className="p-4 font-semibold">Category</th>
                                    <th className="p-4 font-semibold">Price</th>
                                    <th className="p-4 font-semibold">Stock</th>
                                    <th className="p-4 font-semibold">Status</th>
                                    <th className="p-4 text-right font-semibold">Action</th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredFoods.map((food) => (
                                    <tr
                                        key={food.id}
                                        className="border-t hover:bg-gray-50 transition"
                                    >

                                        {/* FOOD */}
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">

                                                <img
                                                    src={food.image}
                                                    className="w-14 h-14 rounded-xl object-cover border"
                                                />

                                                <div>
                                                    <h3 className="font-semibold text-gray-800">
                                                        {food.name}
                                                    </h3>

                                                    <p className="text-xs text-gray-500">
                                                        ID: #{food.id}
                                                    </p>
                                                </div>

                                            </div>
                                        </td>

                                        {/* CATEGORY */}
                                        <td className="p-4">
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                                                {food.category}
                                            </span>
                                        </td>

                                        {/* PRICE */}
                                        <td className="p-4 font-semibold text-green-600">
                                            ${food.price}
                                        </td>

                                        {/* STOCK */}
                                        <td className="p-4">
                                            <span className="font-medium">
                                                {food.stock}
                                            </span>
                                        </td>

                                        {/* STATUS */}
                                        <td className="p-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold
                                ${food.status === 'Available'
                                                        ? 'bg-green-100 text-green-600'
                                                        : 'bg-red-100 text-red-500'
                                                    }`}
                                            >
                                                {food.status}
                                            </span>
                                        </td>

                                        {/* ACTION */}
                                        <td className="p-4">
                                            <div className="flex justify-end gap-2">

                                                <button className="w-9 cursor-pointer  h-9 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition">
                                                    ✏️
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(food.id)}
                                                    className="w-9 h-9 flex  cursor-pointer items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition"
                                                >
                                                    <FiTrash2 size={16} />
                                                </button>

                                            </div>
                                        </td>

                                    </tr>
                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>

                {/* ================= MODAL ================= */}
                {openModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50  ">

                        {/* MODAL BOX */}
                        <div className="bg-white w-[90%] max-w-2xl rounded-2xl p-6 relative h-[90vh] overflow-y-scroll ">

                            {/* CLOSE */}
                            <button
                                onClick={() => setOpenModal(false)}
                                className="absolute top-4 cursor-pointer right-4 text-gray-600"
                            >
                                <FiX size={22} />
                            </button>

                            {/* FORM */}
                            <UploadFoodForm

                            />

                        </div>

                    </div>
                )}

            </section>
        </>
    );
}