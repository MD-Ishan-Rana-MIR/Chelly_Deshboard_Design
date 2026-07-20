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
            <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl border border-gray-100">

                <h2 className="text-xl font-bold mb-4 text-gray-900">Order Details</h2>

                <div className="space-y-4">
                    {/* Header Info */}
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex justify-between items-center">
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Order Number</p>
                            <p className="text-gray-900 font-mono font-bold text-lg">{selectedOrder.order_number}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Date</p>
                            <p className="text-gray-900 font-medium text-sm">
                                {new Date(selectedOrder.created_at).toLocaleString([], {
                                    dateStyle: 'medium',
                                    timeStyle: 'short'
                                })}
                            </p>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Customer Info */}
                        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                            <h3 className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-3 flex items-center gap-1.5 border-b border-gray-50 pb-2">
                                Customer Details
                            </h3>
                            <div className="space-y-2">
                                <div>
                                    <p className="text-xs text-gray-400">Name</p>
                                    <p className="text-sm font-medium text-gray-900 truncate">{(selectedOrder as any).full_name || selectedOrder.user?.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Email</p>
                                    <p className="text-sm font-medium text-gray-900 truncate" title={(selectedOrder as any).email || selectedOrder.user?.email || 'N/A'}>{(selectedOrder as any).email || selectedOrder.user?.email || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Phone</p>
                                    <p className="text-sm font-medium text-gray-900 truncate">{(selectedOrder as any).phone || (selectedOrder.user as any)?.phone || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Address</p>
                                    <p className="text-sm font-medium text-gray-900 line-clamp-2">{(selectedOrder as any).address || (selectedOrder.user as any)?.address || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                            <h3 className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-3 flex items-center gap-1.5 border-b border-gray-50 pb-2">
                                Order Summary
                            </h3>
                            <div className="space-y-3">
                                {/* Map over all items or show fallback */}
                                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                                    selectedOrder.items.map((item, idx) => {
                                        let qty = item.quantity || 1;
                                        let price = Number((item.food as any)?.price || 0);
                                        let itemTotal = 0;
                                        let bundleText = '';
                                        
                                        // Same bundle calculation logic as frontend cart
                                        let remainingQty = qty;
                                        while (remainingQty >= 21 && (21 * price > 120)) {
                                            itemTotal += 120;
                                            remainingQty -= 21;
                                            bundleText = ' (Includes 21-Meal Bundle)';
                                        }
                                        while (remainingQty >= 10 && (10 * price > 70)) {
                                            itemTotal += 70;
                                            remainingQty -= 10;
                                            bundleText = bundleText ? bundleText : ' (Includes 10-Meal Bundle)';
                                        }
                                        itemTotal += remainingQty * price;

                                        return (
                                            <div key={idx} className="flex justify-between items-start gap-4">
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {item.food?.name || 'Custom Order'}
                                                        <span className="text-emerald-600 text-[10px] ml-1 uppercase font-bold">{bundleText}</span>
                                                    </p>
                                                    <p className="text-xs text-gray-400">Qty: {item.quantity || 1}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-gray-900">${itemTotal.toFixed(2)}</p>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">
                                                {selectedOrder.ebt_details?.meal_plan || 'N/A'}
                                            </p>
                                            <p className="text-xs text-gray-400">Qty: 1</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                                    <p className="text-xs font-semibold text-gray-600">Total</p>
                                    <p className="text-sm font-bold text-[#207F36]">${selectedOrder.total_amount}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status Overview */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-xl p-3 border border-gray-100 flex items-center justify-between">
                            <span className="text-xs text-gray-500 font-semibold uppercase">Order Status</span>
                            <span className="capitalize text-xs font-bold bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md">
                                {selectedOrder.status}
                            </span>
                        </div>
                        <div className="bg-white rounded-xl p-3 border border-gray-100 flex items-center justify-between">
                            <span className="text-xs text-gray-500 font-semibold uppercase">Payment</span>
                            <span className="capitalize text-xs font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md">
                                {selectedOrder.payment_status}
                            </span>
                        </div>
                    </div>

                    {/* EBT Payment Details Box */}
                    {selectedOrder.payment_method === 'ebt' && selectedOrder.ebt_details && (() => {
                        const isSecured = ['completed', 'cancelled'].includes(selectedOrder.status.toLowerCase()) || 
                                          (Date.now() - new Date(selectedOrder.created_at).getTime() > 7 * 24 * 60 * 60 * 1000);
                        return (
                            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
                                <div className="flex justify-between items-center mb-3 border-b border-blue-100/50 pb-2">
                                    <h3 className="font-bold text-blue-900 text-sm flex items-center gap-2">
                                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                                        EBT Payment Details
                                    </h3>
                                    {isSecured ? null : (
                                        <button
                                            onClick={() => setIsEbtRevealed(!isEbtRevealed)}
                                            className="text-[10px] uppercase tracking-wider font-bold bg-white hover:bg-gray-50 text-blue-700 border border-blue-200 px-2 py-1 rounded transition-colors"
                                        >
                                            {isEbtRevealed ? 'Hide Data' : 'Reveal'}
                                        </button>
                                    )}
                                </div>
                                
                                {isSecured ? (
                                    <div className="text-sm text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-200">
                                        <p className="flex items-start gap-2">
                                            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                            <span>For security, EBT details are hidden for completed orders or after 7 days.</span>
                                        </p>
                                        <p className="mt-2 font-mono text-xs bg-white/60 p-2 rounded border border-amber-100 inline-block">
                                            Card: **** **** **** {selectedOrder.ebt_details.card_number.slice(-4)}
                                        </p>
                                    </div>
                                ) : (
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Meal Plan</span>
                                        <span className="font-medium text-gray-900">{selectedOrder.ebt_details.meal_plan}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Card Number</span>
                                        <span className="font-mono text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-100">
                                            {isEbtRevealed 
                                                ? selectedOrder.ebt_details.card_number.replace(/(.{4})/g, '$1 ').trim() 
                                                : `**** **** **** ${selectedOrder.ebt_details.card_number.slice(-4)}`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">PIN</span>
                                        <span className="font-mono text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-100">
                                            {isEbtRevealed ? selectedOrder.ebt_details.pin : '****'}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                        );
                    })()}
                </div>

                <div className="mt-5 flex gap-3 pt-4 border-t border-gray-100">
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