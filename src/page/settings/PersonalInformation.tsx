'use client';

import { useState } from 'react';
import { FiSave } from 'react-icons/fi';

type ProfileType = {
    name: string;
    email: string;
    phone: string;
    address: string;
    image: string;
};

export default function PersonalInformation() {
    const [profile, setProfile] = useState<ProfileType>({
        name: 'John Admin',
        email: 'admin@gmail.com',
        phone: '+880 123 456 789',
        address: 'Dhaka, Bangladesh',
        image: 'https://i.pravatar.cc/300',
    });

    // TEXT INPUT
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfile({
            ...profile,
            [e.target.name]: e.target.value,
        });
    };

    // IMAGE UPLOAD
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setProfile({
                ...profile,
                image: reader.result as string,
            });
        };
        reader.readAsDataURL(file);
    };

    // SAVE
    const handleSave = () => {
        // এখানে API call করতে পারো
        console.log(profile);
        alert('Profile updated successfully!');
    };

    return (
        <section className="min-h-screen bg-gray-50 p-6 md:p-10">

            {/* HEADER */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    Admin Profile
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                    Update your personal information
                </p>
            </div>

            {/* CARD */}
            <div className="bg-white rounded-3xl shadow-lg p-6 md:p-10 flex flex-col gap-8">

                {/* IMAGE */}
                <div className="flex flex-col items-center gap-4">

                    <div className="w-32 h-32 rounded-full overflow-hidden border border-[#207F36] focus:outline-0 -4 border border-[#207F36] focus:outline-0 -green-500">
                        <img
                            src={profile.image}
                            alt="profile"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="text-sm"
                    />
                </div>

                {/* FORM */}
                <div className="flex flex-col gap-5">

                    {/* NAME */}
                    <input
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                        placeholder="Name"
                        className="w-full border border-[#207F36] focus:outline-0  p-3 rounded-xl"
                    />

                    {/* EMAIL */}
                    <input
                        name="email"
                        value={profile.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="w-full border border-[#207F36] focus:outline-0  p-3 rounded-xl"
                    />

                    {/* PHONE */}
                    <input
                        name="phone"
                        value={profile.phone}
                        onChange={handleChange}
                        placeholder="Phone"
                        className="w-full border border-[#207F36] focus:outline-0  p-3 rounded-xl"
                    />

                    {/* ADDRESS */}
                    <input
                        name="address"
                        value={profile.address}
                        onChange={handleChange}
                        placeholder="Address"
                        className="w-full border border-[#207F36] focus:outline-0  p-3 rounded-xl"
                    />

                    {/* SAVE */}
                    <button
                        onClick={handleSave}
                        className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold mt-4"
                    >
                        <FiSave />
                        Save Profile
                    </button>
                </div>
            </div>
        </section>
    );
}