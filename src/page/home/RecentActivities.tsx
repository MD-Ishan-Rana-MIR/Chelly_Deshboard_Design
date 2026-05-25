import type { Order } from "./HomePage";

const RecentActivities = ({ resentOrder }: { resentOrder: Order[] }) => {


    const getBadgeStyle = (type: string) => {
        switch (type) {
            case "pending":
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
                        {resentOrder.map((item, index) => (
                            <tr
                                key={index}
                                className="border-b last:border-none hover:bg-gray-50 transition"
                            >
                                {/* Date */}
                                <td className="px-5 py-4 text-sm text-gray-600">
                                   {    new Date(item.created_at).toLocaleString()}
                                </td>

                                {/* Customer */}
                                <td className="px-5 py-4 text-sm font-medium text-gray-800">
                                    {item.user?.name}
                                </td>

                                {/* Order ID */}
                                <td className="px-5 py-4 text-sm text-gray-500">
                                    {item.order_number}
                                </td>

                                {/* Status */}
                                <td className="px-5 py-4">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getBadgeStyle(
                                            item.status
                                        )}`}
                                    >
                                        {item.status}
                                    </span>
                                </td>

                                {/* Amount */}
                                <td className="px-5 py-4 text-sm font-semibold text-gray-800">
                                    {item.total_amount}
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