/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { FiSave } from "react-icons/fi";
import { useAdminProfileQuery, useAdminProfileUpdateMutation } from "../../api/auth/authApi";
import { imgUrl } from "../../lib/url/url";
import toast from "react-hot-toast";
import { errorMessage } from "../../lib/msg/errorMsg";

type ProfileForm = {
    name: string;
    email: string;
    phone: string;
    address: string;
    avatar: any; // file or string
};

export default function PersonalInformation() {
    const { data, isLoading } = useAdminProfileQuery(undefined);

    const [profile, setProfile] = useState<ProfileForm>({
        name: "",
        email: "",
        phone: "",
        address: "",
        avatar: "",
    });

    const [preview, setPreview] = useState<string>("");

    useEffect(() => {
        if (data?.data) {
            setProfile({
                name: data.data.name || "",
                email: data.data.email || "",
                phone: data.data.phone || "",
                address: data.data.address || "",
                avatar: data.data.avatar || "",
            });
        }
    }, [data]);

    // TEXT INPUT
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setProfile((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // IMAGE UPLOAD (FIXED)
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // instant preview
        const url = URL.createObjectURL(file);
        setPreview(url);

        // store file for API upload
        setProfile((prev) => ({
            ...prev,
            avatar: file,
        }));
    };

    const [updateProfile,] = useAdminProfileUpdateMutation();

    // SAVE
    const handleSave = async () => {
        try {
            const formData = new FormData();

            formData.append("name", profile.name);
            formData.append("email", profile.email);
            formData.append("phone", profile.phone);
            formData.append("address", profile.address);

            if (profile.avatar instanceof File) {
                formData.append("avatar", profile.avatar);
            }


            const response = await updateProfile(formData).unwrap();
            if (response) {
                toast.success("Profile updated successfully!");
            }
        } catch (error) {
            return errorMessage(error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
            </div>
        );
    }

    return (
        <section className="min-h-screen bg-gray-50 p-6 md:p-10">
            {/* HEADER */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    Admin Profile
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Update your personal information
                </p>
            </div>

            {/* CARD */}
            <div className="flex flex-col gap-8 rounded-3xl bg-white p-6 shadow-lg md:p-10">

                {/* PROFILE IMAGE */}
                <div className="flex flex-col items-center gap-4">
                    <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-green-600">
                        <img
                            src={
                                preview
                                    ? preview
                                    : profile.avatar
                                        ? `${imgUrl}/${profile.avatar}`
                                        : "https://via.placeholder.com/150"
                            }
                            alt="Profile"
                            className="h-full w-full object-cover"
                        />
                    </div>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="text-sm text-gray-600"
                    />
                </div>

                {/* FORM */}
                <div className="flex flex-col gap-5">

                    {/* NAME */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={profile.name}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-green-600 p-3 focus:outline-none"
                        />
                    </div>

                    {/* EMAIL */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={profile.email}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-green-600 p-3 focus:outline-none"
                        />
                    </div>

                    {/* PHONE */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Phone
                        </label>
                        <input
                            type="text"
                            name="phone"
                            value={profile.phone}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-green-600 p-3 focus:outline-none"
                        />
                    </div>

                    {/* ADDRESS */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Address
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={profile.address}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-green-600 p-3 focus:outline-none"
                        />
                    </div>

                    {/* SAVE BUTTON */}
                    <button
                        type="button"
                        onClick={handleSave}
                        className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
                    >
                        <FiSave size={18} />
                        Save Profile
                    </button>
                </div>
            </div>
        </section>
    );
}