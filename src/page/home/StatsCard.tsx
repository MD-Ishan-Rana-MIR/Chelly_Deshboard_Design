

const statsData = [
    {
        title: "Total Users",
        value: "12,289",
        subtitle: "Active platform users",
        icon: (
            <svg width="61" height="61" viewBox="0 0 61 61" fill="none">
                <rect width="61" height="61" rx="4" fill="#E8EDF5" />
                <path
                    d="M30 20C26 20 23 23 23 27C23 31 26 34 30 34C34 34 37 31 37 27C37 23 34 20 30 20Z"
                    stroke="#486FAF"
                    strokeWidth="3"
                />
            </svg>
        ),
    },
    {
        title: "Total Categories",
        value: "48",
        subtitle: "Food categories available",
        icon: (
            <svg width="61" height="61" viewBox="0 0 61 61" fill="none">
                <rect width="61" height="61" rx="4" fill="#E8EDF5" />
                <path d="M14 20H47M14 30H47M14 40H47" stroke="#486FAF" strokeWidth="3" />
            </svg>
        ),
    },
    {
        title: "Total Foods",
        value: "1,245",
        subtitle: "Menu items available",
        icon: (
            <svg width="61" height="61" viewBox="0 0 61 61" fill="none">
                <rect width="61" height="61" rx="4" fill="#E8EDF5" />
                <path d="M20 18H41V43H20V18Z" stroke="#486FAF" strokeWidth="3" />
            </svg>
        ),
    },
    {
        title: "Total Orders",
        value: "5,672",
        subtitle: "Completed & pending orders",
        icon: (
            <svg width="61" height="61" viewBox="0 0 61 61" fill="none">
                <rect width="61" height="61" rx="4" fill="#E8EDF5" />
                <path d="M18 20H43L40 40H21L18 20Z" stroke="#486FAF" strokeWidth="3" />
            </svg>
        ),
    },
];

import StatsCardItem from "../../components/ui/StatsCardItem";

const StatsCard = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsData.map((item, index) => (
                <StatsCardItem
                    key={index}
                    title={item.title}
                    value={item.value}
                    subtitle={item.subtitle}
                    icon={item.icon}
                />
            ))}
        </div>
    );
};

export default StatsCard;