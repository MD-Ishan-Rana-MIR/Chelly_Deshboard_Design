import { useMemo, useState } from 'react';

export default function OrderManagementPage() {
    const orders = [
        {
            id: '#ORD-1021',
            customer: 'John Smith',
            food: 'Cheese Burger',
            date: '12 Aug 2026',
            amount: '$120.00',
            status: 'Delivered',
        },
        {
            id: '#ORD-1022',
            customer: 'Emma Watson',
            food: 'Chicken Pizza',
            date: '13 Aug 2026',
            amount: '$89.00',
            status: 'Pending',
        },
        {
            id: '#ORD-1023',
            customer: 'Michael Lee',
            food: 'Pasta Alfredo',
            date: '14 Aug 2026',
            amount: '$240.00',
            status: 'Processing',
        },
        {
            id: '#ORD-1024',
            customer: 'Sophia Brown',
            food: 'Fried Chicken',
            date: '15 Aug 2026',
            amount: '$64.00',
            status: 'Cancelled',
        },
    ];

    const [searchId, setSearchId] = useState('');
    const [searchCustomer, setSearchCustomer] = useState('');
    const [searchFood, setSearchFood] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Order Status');
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const matchId = order.id
                .toLowerCase()
                .includes(searchId.toLowerCase());

            const matchCustomer = order.customer
                .toLowerCase()
                .includes(searchCustomer.toLowerCase());

            const matchFood = order.food
                .toLowerCase()
                .includes(searchFood.toLowerCase());

            const matchStatus =
                statusFilter === 'All Order Status'
                    ? true
                    : order.status === statusFilter;

            return matchId && matchCustomer && matchFood && matchStatus;
        });
    }, [searchId, searchCustomer, searchFood, statusFilter]);

    const exportOrdersToCSV = () => {
        const headers = [
            'Order ID',
            'Customer',
            'Food Name',
            'Date',
            'Amount',
            'Status',
        ];

        const rows = filteredOrders.map((order) => [
            order.id,
            order.customer,
            order.food,
            order.date,
            order.amount,
            order.status,
        ]);

        const csvContent = [headers, ...rows]
            .map((row) => row.join(','))
            .join('\n');

        const blob = new Blob([csvContent], {
            type: 'text/csv;charset=utf-8;',
        });

        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'orders.csv');

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Delivered':
                return 'bg-green-100 text-green-700';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-700';
            case 'Processing':
                return 'bg-blue-100 text-blue-700';
            case 'Cancelled':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const resetFilters = () => {
        setSearchId('');
        setSearchCustomer('');
        setSearchFood('');
        setStatusFilter('All Order Status');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Order Management
                        </h1>
                        <p className="mt-2 text-gray-500">
                            Manage all customer orders and track delivery status.
                        </p>
                    </div>

                    <button
                        onClick={exportOrdersToCSV}
                        className="rounded-xl  bg-[#207F36]  cursor-pointer px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-[#1a6b2c]"
                    >
                        Export Orders
                    </button>
                </div>

                {/* Filters */}
                <div className="mt-8 rounded-3xl bg-white p-5 shadow-sm">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <input
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            placeholder="Search by order ID..."
                            className="rounded-xl border border-[#207F36] hover:ring-0 focus:outline-0 focus:ring-0  px-4 py-3"
                        />

                        <input
                            value={searchCustomer}
                            onChange={(e) =>
                                setSearchCustomer(e.target.value)
                            }
                            placeholder="Search by customer..."
                            className="rounded-xl border border-[#207F36] hover:ring-0 focus:outline-0 focus:ring-0  px-4 py-3"
                        />

                        <input
                            value={searchFood}
                            onChange={(e) => setSearchFood(e.target.value)}
                            placeholder="Search by food..."
                            className="rounded-xl border border-[#207F36] hover:ring-0 focus:outline-0 focus:ring-0  px-4 py-3"
                        />

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="rounded-xl border border-[#207F36] hover:ring-0 focus:outline-0 focus:ring-0  px-4 py-3"
                        >
                            <option>All Order Status</option>
                            <option>Delivered</option>
                            <option>Pending</option>
                            <option>Processing</option>
                            <option>Cancelled</option>
                        </select>
                    </div>

                    <div className="mt-4 flex gap-3">
                        <button
                            onClick={resetFilters}
                            className="rounded-xl border border-[#207F36]  cursor-pointer hover:ring-0 focus:outline-0 focus:ring-0  px-5 py-3 text-sm"
                        >
                            Reset
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="mt-8 overflow-hidden rounded-3xl bg-white shadow-sm">
                    <table className="min-w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left">Order ID</th>
                                <th className="px-6 py-4 text-left">Customer</th>
                                <th className="px-6 py-4 text-left">Food</th>
                                <th className="px-6 py-4 text-left">Date</th>
                                <th className="px-6 py-4 text-left">Amount</th>
                                <th className="px-6 py-4 text-left">Status</th>
                                <th className="px-6 py-4 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredOrders.map((order, i) => (
                                <tr key={i} className="border-b">
                                    <td className="px-6 py-5 font-semibold">
                                        {order.id}
                                    </td>
                                    <td className="px-6 py-5">
                                        {order.customer}
                                    </td>
                                    <td className="px-6 py-5">
                                        {order.food}
                                    </td>
                                    <td className="px-6 py-5">
                                        {order.date}
                                    </td>
                                    <td className="px-6 py-5">
                                        {order.amount}
                                    </td>
                                    <td className="px-6 py-5">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs ${getStatusStyle(
                                                order.status
                                            )}`}
                                        >
                                            {order.status}
                                        </span>
                                    </td>

                                    <td className="px-6 py-5 text-right">
                                        <button
                                            onClick={() =>
                                                setSelectedOrder(order)
                                            }
                                            className="rounded-xl cursor-pointer border border-[#207F36] hover:ring-0 focus:outline-0 focus:ring-0  px-4 py-2 text-sm"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL */}
            {selectedOrder && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                    <div className="w-[400px] rounded-2xl bg-white p-6">
                        <h2 className="text-xl font-bold mb-4">
                            Order Details
                        </h2>

                        <div className="space-y-2 text-sm">
                            <p><b>ID:</b> {selectedOrder.id}</p>
                            <p><b>Customer:</b> {selectedOrder.customer}</p>
                            <p><b>Food:</b> {selectedOrder.food}</p>
                            <p><b>Date:</b> {selectedOrder.date}</p>
                            <p><b>Amount:</b> {selectedOrder.amount}</p>
                            <p><b>Status:</b> {selectedOrder.status}</p>
                        </div>

                        <button
                            onClick={() => setSelectedOrder(null)}
                            className="mt-5 w-full cursor-pointer rounded-xl bg-[#0b7211] py-2 text-white"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}