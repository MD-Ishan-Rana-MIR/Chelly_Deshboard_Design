import React, { useState } from 'react';

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

interface OrderEbtDetail {
    card_number: string;
    pin: string;
    meal_plan: string;
}

interface OrderData {
    order_number: string;
    total_amount: string | number;
    payment_status: string;
    payment_method?: string;
    status: string;
    created_at: string;
    user?: OrderUser;
    items?: OrderItem[];
    ebt_details?: OrderEbtDetail;
}

interface OrderDetailsModalProps {
    selectedOrder: OrderData | null;
    setSelectedOrder: (order: any | null) => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
    selectedOrder,
    setSelectedOrder,
}) => {
    const [isEbtRevealed, setIsEbtRevealed] = useState(false);

   
    if (!selectedOrder) return null;

    const handleDownloadPDF = () => {
        if (!selectedOrder) return;

        const formattedDate = new Date(selectedOrder.created_at).toLocaleString([], {
            dateStyle: 'medium',
            timeStyle: 'short',
        });

        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        printWindow.document.write(`
            <html>
            <head>
                <title>Order_${selectedOrder.order_number}</title>
                <style>
                    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; padding: 40px; line-height: 1.6; }
                    .invoice-box { max-width: 600px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, 0.05); border-radius: 8px; }
                    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #207F36; padding-bottom: 20px; margin-bottom: 20px; }
                    .logo { font-size: 24px; font-weight: bold; color: #207F36; }
                    .title { font-size: 20px; font-weight: bold; text-transform: uppercase; color: #555; }
                    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
                    .section-title { font-weight: bold; color: #207F36; margin-bottom: 5px; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; }
                    table { w-full: 100%; width: 100%; border-collapse: collapse; text-align: left; margin-bottom: 30px; }
                    th { background-color: #f9f9f9; padding: 12px; font-weight: bold; border-bottom: 2px solid #eee; }
                    td { padding: 12px; border-bottom: 1px solid #eee; }
                    .total { text-align: right; font-size: 18px; font-weight: bold; color: #207F36; margin-top: 20px; }
                    .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
                    .badge-success { background-color: #e6f4ea; color: #137333; }
                </style>
            </head>
            <body>
                <div class="invoice-box">
                    <div class="header">
                        <div class="logo">Food Portal</div>
                        <div class="title">Invoice</div>
                    </div>
                    
                    <div class="grid">
                        <div>
                            <div class="section-title">Order Info</div>
                            <div><strong>Order No:</strong> ${selectedOrder.order_number}</div>
                            <div><strong>Date:</strong> ${formattedDate}</div>
                            <div><strong>Order Status:</strong> ${selectedOrder.status}</div>
                        </div>
                        <div>
                            <div class="section-title">Customer Details</div>
                            <div><strong>Name:</strong> ${selectedOrder.user?.name || 'N/A'}</div>
                            <div><strong>Email:</strong> ${selectedOrder.user?.email || 'N/A'}</div>
                        </div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Food Item</th>
                                <th>Quantity</th>
                                <th>Payment Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>${selectedOrder.items?.[0]?.food?.name || 'N/A'}</td>
                                <td>${selectedOrder.items?.[0]?.quantity || 1}</td>
                                <td><span class="badge badge-success">${selectedOrder.payment_status}</span></td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="total">Total Amount: $${selectedOrder.total_amount}</div>
                </div>
                <script>
                    window.onload = function() {
                        window.print();
                        setTimeout(function() { window.close(); }, 500);
                    };
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 animate-fade-in">
            <div className="w-[420px] rounded-2xl bg-white p-6 shadow-xl border border-gray-100">

                <h2 className="text-xl font-bold mb-4 text-gray-900">Order Details</h2>

                <div className="space-y-3 text-sm border-t border-b border-gray-100 py-4">
                    <p className="text-gray-700"><b>Order No:</b> <span className="text-gray-900 font-mono font-medium">{selectedOrder.order_number}</span></p>

                    {/* Order Date */}
                    <p className="text-gray-700"><b>Order Date:</b> <span className="text-gray-900">
                        {new Date(selectedOrder.created_at).toLocaleString([], {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                        })}
                    </span></p>

                    <p className="text-gray-700"><b>Customer:</b> <span className="text-gray-900">{selectedOrder.user?.name || 'N/A'}</span></p>
                    <p className="text-gray-700"><b>Email:</b> <span className="text-gray-900">{selectedOrder.user?.email || 'N/A'}</span></p>
                    <p className="text-gray-700"><b>Food Item:</b> <span className="text-gray-900">{selectedOrder.items?.[0]?.food?.name || 'N/A'}</span></p>
                    <p className="text-gray-700"><b>Quantity:</b> <span className="text-gray-900">{selectedOrder.items?.[0]?.quantity || 1}</span></p>
                    <p className="text-gray-700"><b>Total Amount:</b> <span className="text-gray-900 font-bold">${selectedOrder.total_amount}</span></p>
                    <p className="text-gray-700"><b>Payment Status:</b> <span className="capitalize text-emerald-600 font-semibold">{selectedOrder.payment_status}</span></p>
                    <p className="text-gray-700"><b>Payment Method:</b> <span className="capitalize text-gray-900 font-semibold">{selectedOrder.payment_method || 'N/A'}</span></p>
                    <p className="text-gray-700"><b>Order Status:</b> <span className="capitalize text-gray-900">{selectedOrder.status}</span></p>

                    {selectedOrder.payment_method === 'ebt' && selectedOrder.ebt_details && (
                        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-bold text-gray-900">EBT Payment Details</h3>
                                <button
                                    onClick={() => setIsEbtRevealed(!isEbtRevealed)}
                                    className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-800 px-2 py-1 rounded"
                                >
                                    {isEbtRevealed ? 'Hide' : 'Reveal'}
                                </button>
                            </div>
                            <p className="text-gray-700 mt-1"><b>Meal Plan:</b> <span className="text-gray-900">{selectedOrder.ebt_details.meal_plan}</span></p>
                            <p className="text-gray-700"><b>Card Number:</b> <span className="text-gray-900 font-mono">
                                {isEbtRevealed ? selectedOrder.ebt_details.card_number : `**** **** **** ${selectedOrder.ebt_details.card_number.slice(-4)}`}
                            </span></p>
                            <p className="text-gray-700"><b>PIN:</b> <span className="text-gray-900 font-mono">
                                {isEbtRevealed ? selectedOrder.ebt_details.pin : '****'}
                            </span></p>
                        </div>
                    )}
                </div>

                <div className="mt-5 flex gap-3">
                    <button
                        type="button"
                        onClick={() => setSelectedOrder(null)}
                        className="flex-1 cursor-pointer rounded-xl border border-gray-300 bg-white py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Close
                    </button>

                    <button
                        type="button"
                        onClick={handleDownloadPDF}
                        className="flex-1 cursor-pointer rounded-xl bg-[#207F36] py-2.5 text-sm font-semibold text-white hover:bg-[#175c27] transition-colors shadow-sm"
                    >
                        Download PDF
                    </button>
                </div>

            </div>
        </div>
    );
};

export default OrderDetailsModal;