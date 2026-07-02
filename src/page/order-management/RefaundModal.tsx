import React, { useState } from 'react';
import { useRefundPaymentMutation } from '../../api/order/orderApi';
import { errorMessage } from '../../lib/msg/errorMsg';
import ConfirmModal from '../../lib/alert/ConfirmModal';
import toast from 'react-hot-toast';

interface RefaundModalProps {
    orderId: number | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function RefaundModal({ orderId, isOpen, onClose }: RefaundModalProps) {
    const [openPopUpModal, setopenPopUpModal] = useState(false);
    const [refundAmount, setRefundAmount] = useState('');
    
    // RTK Query Mutation Hook
    const [refundPayment, { isLoading }] = useRefundPaymentMutation();

    if (!isOpen) return null;

    // Triggers when validation passes on the main form button click
    const handleOpenPopUp = (e: React.FormEvent) => {
        e.preventDefault();
        setopenPopUpModal(true);
    };

    const handleCancelConfirmation = () => {
        setopenPopUpModal(false);
    };

    // Executes the actual backend endpoint transaction
    const handleSubmit = async () => {
        try {
            const res = await refundPayment({
                id: orderId,
                amount: Number(refundAmount),
            }).unwrap();
            
            // Cleanup on success
            setopenPopUpModal(false);
            setRefundAmount('');
            onClose(); 
            return toast.success(res?.message)
        } catch (error) {
            setopenPopUpModal(false);
            errorMessage(error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md transform overflow-hidden rounded-3xl bg-white p-6 text-left align-middle shadow-xl transition-all">

                {/* Title header */}
                <div className="flex items-center justify-between border-b pb-3">
                    <h3 className="text-xl font-bold text-gray-900">
                        Process Order Refund
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 font-bold text-lg cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                {/* Form Wrapper */}
                <form onSubmit={handleOpenPopUp} className="mt-4 space-y-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">
                            Enter Amount
                        </label>
                        <input
                            type="number"
                            step="any"
                            required
                            value={refundAmount}
                            onChange={(e) => setRefundAmount(e.target.value)}
                            placeholder="Enter the amount"
                            className="w-full rounded-xl border border-[#207F36] px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#207F36]"
                        />
                    </div>

                    {/* Action controls buttons layout */}
                    <div className="mt-6 flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 cursor-pointer shadow-sm"
                        >
                            Submit Refund
                        </button>
                    </div>
                </form>

            </div>

            {/* Nested PopUp Safe Confirmation Interceptor */}
            <ConfirmModal
                open={openPopUpModal}
                title="Confirm Refund Payment"
                description={`Are you sure you want to process a refund of $${refundAmount} for order #${orderId}?`}
                confirmText={isLoading ? "Processing..." : "Yes, Refund"}
                cancelText="No, Go Back"
                onConfirm={handleSubmit}
                onCancel={handleCancelConfirmation}
                loading={isLoading}
            />
        </div>
    );
}