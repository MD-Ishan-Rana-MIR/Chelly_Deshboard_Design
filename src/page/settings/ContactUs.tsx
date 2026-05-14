'use client';

import { useState } from 'react';
import { FiSave } from 'react-icons/fi';

type ContactType = {
    email: string;
    phone: string;
    address: string;
};

type SocialType = {
    tiktok: string;
    instagram: string;
    twitter: string;
    youtube: string;
};

export default function ContactInformation() {
    const [contact, setContact] = useState<ContactType>({
        email: 'admin@gmail.com',
        phone: '+880 123 456 789',
        address: 'Dhaka, Bangladesh',
    });

    const [social, setSocial] = useState<SocialType>({
        tiktok: '',
        instagram: '',
        twitter: '',
        youtube: '',
    });

    // CONTACT CHANGE
    const handleContactChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setContact({
            ...contact,
            [e.target.name]: e.target.value,
        });
    };

    // SOCIAL CHANGE
    const handleSocialChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setSocial({
            ...social,
            [e.target.name]: e.target.value,
        });
    };

    // SAVE ALL
    const handleSave = () => {
        console.log({
            contact,
            social,
        });

        alert('Information updated successfully!');
    };

    return (
        <section className="min-h-screen bg-gray-50 p-6 md:p-10">

            {/* HEADER */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    Contact Information
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                    Update contact details and social media links
                </p>
            </div>

            {/* MAIN CARD */}
            <div className="bg-white rounded-3xl shadow-lg p-6 md:p-10 space-y-10">

                {/* ================= CONTACT ================= */}
                <div className="space-y-5">
                    <h2 className="text-lg font-bold text-gray-800">
                        Contact Details
                    </h2>

                    {/* EMAIL */}
                    <div>
                        <label className="text-sm text-gray-600 mb-2 block">
                            Email Address
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={contact.email}
                            onChange={handleContactChange}
                            className="w-full border border-[#207F36] p-3 rounded-xl outline-none"
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
                            onChange={handleContactChange}
                            className="w-full border border-[#207F36] p-3 rounded-xl outline-none"
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
                            onChange={handleContactChange}
                            className="w-full border border-[#207F36] p-3 rounded-xl outline-none"
                        />
                    </div>
                </div>

                {/* ================= SOCIAL MEDIA ================= */}
                <div className="space-y-5">
                    <h2 className="text-lg font-bold text-gray-800">
                        Social Media Links
                    </h2>

                    {/* TikTok */}
                    <div>
                        <label className="text-sm text-gray-600 mb-2 block">
                            TikTok Link
                        </label>
                        <input
                            type="text"
                            name="tiktok"
                            value={social.tiktok}
                            onChange={handleSocialChange}
                            placeholder="https://tiktok.com/@username"
                            className="w-full border border-[#207F36] p-3 rounded-xl outline-none"
                        />
                    </div>

                    {/* Instagram */}
                    <div>
                        <label className="text-sm text-gray-600 mb-2 block">
                            Instagram Link
                        </label>
                        <input
                            type="text"
                            name="instagram"
                            value={social.instagram}
                            onChange={handleSocialChange}
                            placeholder="https://instagram.com/username"
                            className="w-full border border-[#207F36] p-3 rounded-xl outline-none"
                        />
                    </div>

                    {/* Twitter */}
                    <div>
                        <label className="text-sm text-gray-600 mb-2 block">
                            Twitter Link
                        </label>
                        <input
                            type="text"
                            name="twitter"
                            value={social.twitter}
                            onChange={handleSocialChange}
                            placeholder="https://twitter.com/username"
                            className="w-full border border-[#207F36] p-3 rounded-xl outline-none"
                        />
                    </div>

                    {/* YouTube */}
                    <div>
                        <label className="text-sm text-gray-600 mb-2 block">
                            YouTube Link
                        </label>
                        <input
                            type="text"
                            name="youtube"
                            value={social.youtube}
                            onChange={handleSocialChange}
                            placeholder="https://youtube.com/@channel"
                            className="w-full border border-[#207F36] p-3 rounded-xl outline-none"
                        />
                    </div>
                </div>

                {/* SAVE BUTTON */}
                <button
                    onClick={handleSave}
                    className="flex items-center justify-center gap-2 bg-[#207F36] cursor-pointer hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold w-full"
                >
                    <FiSave />
                    Save All Information
                </button>
            </div>
        </section>
    );
}