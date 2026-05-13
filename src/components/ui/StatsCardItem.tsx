import React from "react";

type StatsCardItemProps = {
    title: string;
    value: string;
    subtitle: string;
    icon: React.ReactNode;
};

const StatsCardItem = ({ title, value, subtitle, icon }: StatsCardItemProps) => {
    return (
        <div className="bg-white shadow-md rounded-xl p-5 flex items-center justify-between hover:shadow-lg transition">
            {/* Left Content */}
            <div>
                <h1 className="text-gray-600 text-lg font-medium">{title}</h1>
                <p className="text-[#1A4B9B] text-2xl font-bold my-2">{value}</p>
                <p className="text-gray-400 text-sm">{subtitle}</p>
            </div>

            {/* Icon */}
            <div>{icon}</div>
        </div>
    );
};

export default StatsCardItem;