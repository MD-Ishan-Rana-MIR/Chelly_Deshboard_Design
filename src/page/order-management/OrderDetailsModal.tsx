import React from 'react';

interface OrderItem {
    id: number;
    food?: {
        name: string;
    };
    quantity: number;
}

interface OrderUser {
    name: string;
    email: string;
}

interface OrderData {
    order_number: string;
    total_amount: string | number;
    payment_status: string;
    status: string;
    user?: OrderUser;
    items?: OrderItem[];
}

interface OrderDetailsModalProps {
    selectedOrder: OrderData | null;
    setSelectedOrder: (order: any | null) => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
    selectedOrder,
    setSelectedOrder,
}) => {
    // Prevent rendering entirely if no active order detail layout is targeted
    if (!selectedOrder) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="w-[400px] rounded-2xl bg-white p-6 shadow-xl">
                
                <h2 className="text-xl font-bold mb-4 text-gray-900">Order Details</h2>
                
                <div className="space-y-3 text-sm border-t border-b border-gray-100 py-4">
                    <p className="text-gray-700"><b>Order No:</b> <span className="text-gray-900">{selectedOrder.order_number}</span></p>
                    <p className="text-gray-700"><b>Customer:</b> <span className="text-gray-900">{selectedOrder.user?.name || 'N/A'}</span></p>
                    <p className="text-gray-700"><b>Email:</b> <span className="text-gray-900">{selectedOrder.user?.email || 'N/A'}</span></p>
                    <p className="text-gray-700"><b>Food Item:</b> <span className="text-gray-900">{selectedOrder.items?.[0]?.food?.name || 'N/A'}</span></p>
                    <p className="text-gray-700"><b>Quantity:</b> <span className="text-gray-900">{selectedOrder.items?.[0]?.quantity || 1}</span></p>
                    <p className="text-gray-700"><b>Total Amount:</b> <span className="text-gray-900">${selectedOrder.total_amount}</span></p>
                    <p className="text-gray-700"><b>Payment Status:</b> <span className="capitalize text-emerald-600 font-semibold">{selectedOrder.payment_status}</span></p>
                    <p className="text-gray-700"><b>Order Status:</b> <span className="capitalize text-gray-900">{selectedOrder.status}</span></p>
                </div>

                {/* Single Close Button spanning full width */}
                <div className="mt-5">
                    <button
                        type="button"
                        onClick={() => setSelectedOrder(null)}
                        className="w-full cursor-pointer rounded-xl bg-gray-800 py-2.5 text-sm font-medium text-white hover:bg-gray-900 transition-colors"
                    >
                        Close
                    </button>
                </div>
                
            </div>
        </div>
    );
};

export default OrderDetailsModal;