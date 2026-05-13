
const RecentActivities = () => {
    const tableData = [
        {
            date: "2026-02-23",
            customer: "John Doe",
            orderId: "#FD1023",
            status: "Delivered",
            amount: "$24.50",
            type: "success",
        },
        {
            date: "2026-02-22",
            customer: "Sarah Lee",
            orderId: "#FD1024",
            status: "Processing",
            amount: "$18.00",
            type: "info",
        },
        {
            date: "2026-02-22",
            customer: "Michael Smith",
            orderId: "#FD1025",
            status: "Pending",
            amount: "$32.75",
            type: "warning",
        },
        {
            date: "2026-02-21",
            customer: "Amanda Clark",
            orderId: "#FD1026",
            status: "Cancelled",
            amount: "$15.00",
            type: "danger",
        },
    ];

    const getBadgeStyle = (type: string) => {
        switch (type) {
            case "success":
                return "bg-green-100 text-green-700";
            case "info":
                return "bg-blue-100 text-blue-700";
            case "warning":
                return "bg-yellow-100 text-yellow-700";
            case "danger":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="mt-10 bg-white rounded-xl shadow-sm p-6">

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Recent Orders
                </h1>
                <p className="text-sm text-gray-500">
                    Latest food delivery orders from customers
                </p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full">

                    {/* Head */}
                    <thead>
                        <tr className="bg-gray-100 text-left text-sm text-gray-600">
                            <th className="px-5 py-3">Date</th>
                            <th className="px-5 py-3">Customer</th>
                            <th className="px-5 py-3">Order ID</th>
                            <th className="px-5 py-3">Status</th>
                            <th className="px-5 py-3">Amount</th>
                        </tr>
                    </thead>

                    {/* Body */}
                    <tbody>
                        {tableData.map((item, index) => (
                            <tr
                                key={index}
                                className="border-b last:border-none hover:bg-gray-50 transition"
                            >
                                {/* Date */}
                                <td className="px-5 py-4 text-sm text-gray-600">
                                    {item.date}
                                </td>

                                {/* Customer */}
                                <td className="px-5 py-4 text-sm font-medium text-gray-800">
                                    {item.customer}
                                </td>

                                {/* Order ID */}
                                <td className="px-5 py-4 text-sm text-gray-500">
                                    {item.orderId}
                                </td>

                                {/* Status */}
                                <td className="px-5 py-4">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getBadgeStyle(
                                            item.type
                                        )}`}
                                    >
                                        {item.status}
                                    </span>
                                </td>

                                {/* Amount */}
                                <td className="px-5 py-4 text-sm font-semibold text-gray-800">
                                    {item.amount}
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </div>
    );
};

export default RecentActivities;