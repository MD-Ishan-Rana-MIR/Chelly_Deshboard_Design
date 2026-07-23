"use client";

import React, { useEffect, useState } from "react";
import { FiSave } from "react-icons/fi";
import toast from "react-hot-toast";
import { errorMessage } from "../../lib/msg/errorMsg";
import DotsLoader from "../../components/loader/DotsLoader";
import { useGetAllContactInformationQuery, useStoreSettingPageMutation } from "../../api/setting/settingApi";

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

export default function StoreConfiguration() {
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [lowStockThreshold, setLowStockThreshold] = useState<number>(5);

    // ===================== GET API =====================
    const { data, isLoading: isFetching } = useGetAllContactInformationQuery(undefined);

    // ===================== SAVE API =====================
    const [storeSetting, { isLoading }] = useStoreSettingPageMutation();

    // ===================== SET DEFAULT VALUE =====================
    useEffect(() => {
        if (data?.data) {
            if (data.data.allowed_checkout_days) {
                try {
                    const days = typeof data.data.allowed_checkout_days === 'string' 
                        ? JSON.parse(data.data.allowed_checkout_days) 
                        : data.data.allowed_checkout_days;
                    if (Array.isArray(days)) {
                        setSelectedDays(days);
                    }
                } catch (e) {
                    console.error("Failed to parse allowed_checkout_days", e);
                }
            }
            if (data.data.low_stock_threshold) {
                setLowStockThreshold(Number(data.data.low_stock_threshold));
            }
        }
    }, [data]);

    // ===================== TOGGLE DAY =====================
    const toggleDay = (day: string) => {
        setSelectedDays(prev => 
            prev.includes(day) 
                ? prev.filter(d => d !== day) 
                : [...prev, day]
        );
    };

    // ===================== SAVE =====================
    const handleSave = async () => {
        try {
            const payload = {
                allowed_checkout_days: JSON.stringify(selectedDays),
                low_stock_threshold: lowStockThreshold
            };
            const res = await storeSetting(payload).unwrap();
            toast.success(res?.message || "Settings updated successfully");
        } catch (error) {
            return errorMessage(error);
        }
    };

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
                    Store Configuration
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                    Manage core store operational settings
                </p>
            </div>

            {/* CARD */}
            <div className="bg-white rounded-3xl shadow-lg p-6 md:p-10 space-y-10">
                
                {/* SETTINGS SECTION */}
                <div className="space-y-5">
                    <h2 className="text-lg font-bold text-gray-800 border-b pb-2">
                        Checkout Restrictions
                    </h2>
                    <p className="text-gray-600 text-sm mb-4">
                        Select the days of the week when customers are allowed to place orders. If no days are selected, checkout will be completely disabled.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {DAYS_OF_WEEK.map((day) => (
                            <label key={day} className="flex items-center space-x-3 cursor-pointer p-3 border rounded-xl hover:bg-gray-50 transition-colors">
                                <input 
                                    type="checkbox" 
                                    className="w-5 h-5 text-[#207F36] rounded focus:ring-[#207F36]"
                                    checked={selectedDays.includes(day)}
                                    onChange={() => toggleDay(day)}
                                />
                                <span className="text-gray-700 font-medium">{day}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* LOW STOCK SETTINGS */}
                <div className="space-y-5">
                    <h2 className="text-lg font-bold text-gray-800 border-b pb-2">
                        Inventory Management
                    </h2>
                    <p className="text-gray-600 text-sm mb-4">
                        Set the minimum stock threshold. You will receive an alert when a food item's stock falls to this level or below.
                    </p>

                    <div className="flex flex-col md:w-1/2">
                        <label className="text-gray-700 font-semibold mb-2">Low Stock Alert Threshold</label>
                        <input 
                            type="number"
                            min="0"
                            value={lowStockThreshold}
                            onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                            className="border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#207F36]"
                        />
                    </div>
                </div>

                {/* SAVE BUTTON */}
                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex items-center cursor-pointer justify-center gap-2 bg-[#207F36] hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold w-full md:w-auto px-10 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <DotsLoader />
                    ) : (
                        <>
                            <FiSave />
                            Save Configuration
                        </>
                    )}
                </button>
            </div>
        </section>
    );
}
