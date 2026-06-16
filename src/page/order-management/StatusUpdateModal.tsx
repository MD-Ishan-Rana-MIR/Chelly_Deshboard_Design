import React, { useState } from 'react';
import ConfirmModal from '../../lib/alert/ConfirmModal';
import { useOrderStatusUpdateMutation } from '../../api/order/orderApi';

// Define the shape of the props the modal requires
interface StatusUpdateModalProps {
    updatingOrder: {
        id: number | string;
        order_number: string;
        status: string;
    } | null;
    setUpdatingOrder: (order: any | null) => void;
    newStatus: string;
    setNewStatus: (status: string) => void;
}

const StatusUpdateModal: React.FC<StatusUpdateModalProps> = ({
    updatingOrder,
    setUpdatingOrder,
    newStatus,
    setNewStatus,
}) => {
    const [openPopUpModal, setOpenPopUpModal] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false); // State tracker for your API mutation

    const [orderStatusUpdate] = useOrderStatusUpdateMutation()

    // Move Hook declarations above early exits to prevent breaking React rules
    if (!updatingOrder) return null;

    // Phase 1: Triggered when hitting "Save Changes" on the main modal layout
    const handleInitiateSave = () => {
        setOpenPopUpModal(true);
    };

    // Phase 2: Triggered inside ConfirmModal when clicking confirm action
    const handleUpdateStatus = async () => {
        console.log(`Updating Order ${updatingOrder.id} status to: ${newStatus}`);
        const payload = {
            status: newStatus
        }

        setIsLoading(true);
        try {
            const res = await orderStatusUpdate({ id: updatingOrder?.id, payload: payload }).unwrap();
            console.log(res)
            if (res) {
                setOpenPopUpModal(false);
                setUpdatingOrder(null);
            }
        } catch (error) {
            console.error("Failed to update order status:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelConfirmation = () => {
        setOpenPopUpModal(false);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="w-[400px] rounded-2xl bg-white p-6 shadow-xl">
                <h2 className="text-xl font-bold mb-2">Update Order Status</h2>
                <p className="text-sm text-gray-500 mb-4">
                    Change status for Order <span className="font-semibold">{updatingOrder.order_number}</span>
                </p>

                <div className="mb-5">
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">
                        Status
                    </label>
                    <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="w-full rounded-xl border border-[#207F36] p-3 text-sm focus:outline-none bg-white capitalize"
                    >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => setUpdatingOrder(null)}
                        className="w-1/2 cursor-pointer rounded-xl border border-gray-300 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleInitiateSave}
                        className="w-1/2 cursor-pointer rounded-xl bg-[#207F36] py-2.5 text-sm text-white hover:bg-[#1a6b2c] transition-colors"
                    >
                        Save Changes
                    </button>
                </div>
            </div>

            {/* CONFIRMATION POPUP MODAL */}
            <ConfirmModal
                open={openPopUpModal}
                title="Confirm Status Change"
                description={`Are you sure you want to update order ${updatingOrder.order_number} to "${newStatus}"?`}
                confirmText={isLoading ? "Processing..." : "Yes, Update"}
                cancelText="No, Go Back"
                onConfirm={handleUpdateStatus}
                onCancel={handleCancelConfirmation}
                loading={isLoading}
            />
        </div>
    );
};

export default StatusUpdateModal;