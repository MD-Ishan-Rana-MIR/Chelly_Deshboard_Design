'use client';

import  { useMemo, useState } from "react";
import { FiPlus, FiTrash2, FiEdit2, FiX } from "react-icons/fi";
import { Editor } from 'primereact/editor';

type Offer = {
    id: number;
    title: string;
    discount: string;
    description: string;
    status: "Active" | "Inactive";
};

export default function Offer() {

    const [offers, setOffers] = useState<Offer[]>([
        {
            id: 1,
            title: "Summer Special",
            discount: "20%",
            description: "Get amazing summer discount on all foods",
            status: "Active",
        },
        {
            id: 2,
            title: "Burger Fest",
            discount: "15%",
            description: "Special discount on all burgers",
            status: "Inactive",
        },
    ]);

    const [openModal, setOpenModal] = useState(false);

    const [form, setForm] = useState({
        title: "",
        discount: "",
        description: "",
    });

    const handleAddOffer = () => {
        const newOffer: Offer = {
            id: Date.now(),
            title: form.title,
            discount: form.discount,
            description: form.description,
            status: "Active",
        };

        setOffers((prev) => [newOffer, ...prev]);

        setForm({
            title: "",
            discount: "",
            description: "",
        });

        setOpenModal(false);
    };

    const handleDelete = (id: number) => {
        setOffers((prev) => prev.filter((o) => o.id !== id));
    };

    const filteredOffers = useMemo(() => offers, [offers]);

    return (
        <section className="min-h-screen bg-gray-50 p-6 md:p-10">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-8">

                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Offer Management
                    </h1>
                    <p className="text-gray-500">
                        Create and manage discount offers
                    </p>
                </div>

                <button
                    onClick={() => setOpenModal(true)}
                    className="flex items-center gap-2 bg-[#207F36] cursor-pointer text-white px-5 py-3 rounded-2xl font-semibold"
                >
                    <FiPlus />
                    Add Offer
                </button>

            </div>

            {/* TABLE */}
            <div className="bg-white rounded-2xl shadow overflow-hidden">

                <table className="w-full">

                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-4 text-left">Title</th>
                            <th className="p-4 text-left">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredOffers.map((offer) => (
                            <tr key={offer.id} className="border-t">

                                <td className="p-4 font-medium">
                                    {offer.title}
                                </td>

                                

                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${offer.status === "Active"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-200 text-gray-600"
                                        }`}>
                                        {offer.status}
                                    </span>
                                </td>

                                <td className="p-4">
                                    <div className="flex justify-end gap-3">

                                        <button className="text-[#207F36] cursor-pointer hover:bg-green-100 p-2 rounded-xl">
                                            <FiEdit2 />
                                        </button>

                                        <button
                                            onClick={() => handleDelete(offer.id)}
                                            className="text-red-600 cursor-pointer hover:bg-red-50 p-2 rounded-xl"
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
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

                    <div className="bg-white w-[95%] max-w-2xl p-6 rounded-2xl relative">

                        {/* CLOSE */}
                        <button
                            onClick={() => setOpenModal(false)}
                            className="absolute top-4 right-4 text-gray-600"
                        >
                            <FiX size={22} />
                        </button>

                        <h2 className="text-2xl font-bold mb-4">
                            Create Offer
                        </h2>

                     


                        {/* PRIME EDITOR */}
                        <div className="border rounded-xl overflow-hidden mb-4">
                            <Editor
                                value={form.description}
                                onTextChange={(e) =>
                                    setForm({ ...form, description: e.htmlValue || "" })
                                }
                                style={{ height: "180px" }}
                            />
                        </div>

                        {/* BUTTON */}
                        <button
                            onClick={handleAddOffer}
                            className="w-full bg-[#207F36] cursor-pointer text-white py-3 rounded-xl font-semibold"
                        >
                            Save Offer
                        </button>

                    </div>

                </div>
            )}

        </section>
    );
}