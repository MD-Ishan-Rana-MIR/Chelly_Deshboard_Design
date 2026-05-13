'use client';

import { useState } from 'react';
import { FiSave } from 'react-icons/fi';

type ContactType = {
    email: string;
    phone: string;
    address: string;
};

export default function ContactInformation() {
    const [contact, setContact] = useState<ContactType>({
        email: 'admin@gmail.com',
        phone: '+880 123 456 789',
        address: 'Dhaka, Bangladesh',
    });

    // HANDLE INPUT
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setContact({
            ...contact,
            [e.target.name]: e.target.value,
        });
    };

    // SAVE
    const handleSave = () => {
        console.log(contact);
        alert('Contact information updated successfully!');
    };

    return (
        <section className="min-h-screen bg-gray-50 p-6 md:p-10">

            {/* HEADER */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    Contact Information
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                    Update your email, phone number and address
                </p>
            </div>

            {/* CARD */}
            <div className="bg-white rounded-3xl shadow-lg p-6 md:p-10 space-y-6">

                {/* EMAIL */}
                <div>
                    <label className="text-sm text-gray-600 mb-2 block">
                        Email Address
                    </label>

                    <input
                        type="email"
                        name="email"
                        value={contact.email}
                        onChange={handleChange}
                        placeholder="Enter email"
                        className="w-full border border-[#207F36] p-3 rounded-xl outline-none focus:ring-0 "
                    />
                </div>

                {/* PHONE */}
                <div>
                    <label className="text-sm text-gray-600 mb-2 block">
                        Phone Number
                    </label>

                    <input
                        type="text"
                        name="phone"
                        value={contact.phone}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                        className="w-full border border-[#0b7211] p-3 rounded-xl outline-none focus:ring-0 "
                    />
                </div>

                {/* ADDRESS */}
                <div>
                    <label className="text-sm text-gray-600 mb-2 block">
                        Address
                    </label>

                    <input
                        type="text"
                        name="address"
                        value={contact.address}
                        onChange={handleChange}
                        placeholder="Enter address"
                        className="w-full border border-[#207F36] p-3 rounded-xl outline-none focus:ring-0 "
                    />
                </div>

                {/* SAVE BUTTON */}
                <button
                    onClick={handleSave}
                    className="flex items-center justify-center gap-2 cursor-pointer bg-[#207F36] hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold w-full"
                >
                    <FiSave />
                    Save Contact Info
                </button>
            </div>
        </section>
    );
}