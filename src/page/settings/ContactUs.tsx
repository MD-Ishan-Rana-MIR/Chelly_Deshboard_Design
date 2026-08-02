"use client";

import { useEffect, useState } from "react";
import { FiSave } from "react-icons/fi";
import toast from "react-hot-toast";
import { errorMessage } from "../../lib/msg/errorMsg";
import DotsLoader from "../../components/loader/DotsLoader";
import { 
  useGetAllContactInformationQuery, 
  usePostContactInformationMutation 
} from "../../api/setting/settingApi";

type FormType = {
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  tiktok_url: string;
  instagram_url: string;
  twitter_url: string;
  youtube_url: string;
};

export default function ContactInformation() {
  const [form, setForm] = useState<FormType>({
    contact_email: "",
    contact_phone: "",
    contact_address: "",
    tiktok_url: "",
    instagram_url: "",
    twitter_url: "",
    youtube_url: "",
  });

  // Track whether form has been populated initially
  const [isInitialized, setIsInitialized] = useState(false);

  // ===================== GET API =====================
  const { data, isLoading: isFetching } = useGetAllContactInformationQuery(undefined);

  // ===================== SAVE API =====================
  const [postContactInformation, { isLoading }] = usePostContactInformationMutation();

  // ===================== SET DEFAULT VALUE FROM API =====================
  useEffect(() => {
    if (data?.data && !isInitialized) {
      setForm({
        contact_email: data.data.contact_email || "",
        contact_phone: data.data.contact_phone || "",
        contact_address: data.data.contact_address || "",
        tiktok_url: data.data.tiktok_url || "",
        instagram_url: data.data.instagram_url || "",
        twitter_url: data.data.twitter_url || "",
        youtube_url: data.data.youtube_url || "",
      });
      setIsInitialized(true);
    }
  }, [data, isInitialized]);

  // ===================== HANDLE CHANGE =====================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ===================== SAVE =====================
  const handleSave = async () => {
    try {
      const res = await postContactInformation(form).unwrap();
      toast.success(res?.message || "Updated successfully");
    } catch (error) {
      errorMessage(error);
    }
  };

  // ===================== LOADING =====================
  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <DotsLoader />
      </div>
    );
  }

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

      {/* CARD */}
      <div className="bg-white rounded-3xl shadow-lg p-6 md:p-10 space-y-10">
        {/* ================= CONTACT ================= */}
        <div className="space-y-5">
          <h2 className="text-lg font-bold text-gray-800">
            Contact Details
          </h2>

          {/* EMAIL */}
          <input
            type="email"
            name="contact_email"
            value={form.contact_email}
            onChange={handleChange}
            placeholder="Email Address"
            className="w-full border border-[#207F36] p-3 rounded-xl outline-none"
          />

          {/* PHONE */}
          <input
            type="text"
            name="contact_phone"
            value={form.contact_phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full border border-[#207F36] p-3 rounded-xl outline-none"
          />

          {/* ADDRESS */}
          <input
            type="text"
            name="contact_address"
            value={form.contact_address}
            onChange={handleChange}
            placeholder="Address"
            className="w-full border border-[#207F36] p-3 rounded-xl outline-none"
          />
        </div>

        {/* ================= SOCIAL ================= */}
        <div className="space-y-5">
          <h2 className="text-lg font-bold text-gray-800">
            Social Media Links
          </h2>

          <input
            type="text"
            name="tiktok_url"
            value={form.tiktok_url}
            onChange={handleChange}
            placeholder="TikTok URL"
            className="w-full border border-[#207F36] p-3 rounded-xl outline-none"
          />

          <input
            type="text"
            name="instagram_url"
            value={form.instagram_url}
            onChange={handleChange}
            placeholder="Instagram URL"
            className="w-full border border-[#207F36] p-3 rounded-xl outline-none"
          />

          <input
            type="text"
            name="twitter_url"
            value={form.twitter_url}
            onChange={handleChange}
            placeholder="Twitter URL"
            className="w-full border border-[#207F36] p-3 rounded-xl outline-none"
          />

          <input
            type="text"
            name="youtube_url"
            value={form.youtube_url}
            onChange={handleChange}
            placeholder="YouTube URL"
            className="w-full border border-[#207F36] p-3 rounded-xl outline-none"
          />
        </div>

        {/* SAVE BUTTON */}
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="flex items-center cursor-pointer justify-center gap-2 bg-[#207F36] hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold w-full disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <DotsLoader />
          ) : (
            <>
              <FiSave />
              Save All Information
            </>
          )}
        </button>
      </div>
    </section>
  );
}