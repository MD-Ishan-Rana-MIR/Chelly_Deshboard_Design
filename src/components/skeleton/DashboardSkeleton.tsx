import {
    Users,
    LayoutGrid,
    UtensilsCrossed,
    ShoppingBasket,
} from "lucide-react";

const stats = [
    {
        title: "Total Users",
        value: "12,289",
        desc: "Active platform users",
        icon: <Users size={34} className="text-[#4169B0]" />,
    },
    {
        title: "Total Categories",
        value: "48",
        desc: "Food categories available",
        icon: <LayoutGrid size={34} className="text-[#4169B0]" />,
    },
    {
        title: "Total Foods",
        value: "1,245",
        desc: "Menu items available",
        icon: <UtensilsCrossed size={34} className="text-[#4169B0]" />,
    },
    {
        title: "Total Orders",
        value: "5,672",
        desc: "Completed & pending orders",
        icon: <ShoppingBasket size={34} className="text-[#4169B0]" />,
    },
];

const rows = [1, 2, 3, 4];

export default function DashboardSkeleton() {
    return (
        <div className="min-h-screen animate-pulse  p-6">

            {/* TITLE */}
            <div className="mb-10 h-10 w-56 rounded-lg bg-white/20" />

            {/* TOP CARDS */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

                {stats.map((item, index) => (
                    <div
                        key={index}
                        className="rounded-3xl bg-white p-6 shadow-sm"
                    >
                        <div className="flex items-start justify-between">

                            <div className="flex-1">
                                <div className="mb-4 h-5 w-32 rounded bg-gray-200" />

                                <div className="mb-4 h-8 w-24 rounded bg-gray-300" />

                                <div className="h-4 w-40 rounded bg-gray-200" />
                            </div>

                            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-[#EEF1F5]">
                                {item.icon}
                            </div>

                        </div>
                    </div>
                ))}

            </div>

            {/* TABLE CARD */}
            <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm">

                {/* HEADER */}
                <div className="mb-2 h-8 w-52 rounded bg-gray-300" />

                <div className="mb-8 h-4 w-72 rounded bg-gray-200" />

                {/* TABLE */}
                <div className="overflow-x-auto">

                    {/* TABLE HEAD */}
                    <div className="grid min-w-[900px] grid-cols-5 rounded-lg bg-[#F3F4F6] px-5 py-4">

                        <div className="h-5 w-16 rounded bg-gray-300" />
                        <div className="h-5 w-24 rounded bg-gray-300" />
                        <div className="h-5 w-20 rounded bg-gray-300" />
                        <div className="h-5 w-16 rounded bg-gray-300" />
                        <div className="h-5 w-20 rounded bg-gray-300" />

                    </div>

                    {/* TABLE BODY */}
                    {rows.map((_, index) => (
                        <div
                            key={index}
                            className="grid min-w-[900px] grid-cols-5 items-center border-b border-gray-100 px-5 py-6"
                        >

                            <div className="h-4 w-24 rounded bg-gray-200" />

                            <div className="h-4 w-32 rounded bg-gray-200" />

                            <div className="h-4 w-20 rounded bg-gray-200" />

                            <div className="h-8 w-24 rounded-full bg-gray-200" />

                            <div className="h-4 w-16 rounded bg-gray-200" />

                        </div>
                    ))}

                </div>

            </div>

        </div>
    );
}