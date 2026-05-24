import { X } from "lucide-react";
import React from "react";

type ConfirmModalProps = {
    open: boolean;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    open,
    title = "Are you sure?",
    description = "Do you really want to continue this action?",
    confirmText = "Yes",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
}) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[9999] h-screen flex items-center justify-center">
            {/* Overlay */}
            <div
                onClick={onCancel}
                className="absolute inset-0 bg-black/50"
            />

            {/* Modal Box */}
            <div className="relative w-[90%] max-w-md rounded-2xl bg-white p-6 shadow-xl">
                {/* Close button */}
                <button
                    onClick={onCancel}
                    className="absolute right-3 cursor-pointer top-3 text-gray-500 hover:text-black"
                >
                    <X size={20} />
                </button>

                {/* Content */}
                <h2 className="text-xl font-semibold text-gray-800">
                    {title}
                </h2>

                {description && (
                    <p className="mt-2 text-sm text-gray-500">
                        {description}
                    </p>
                )}

                {/* Buttons */}
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="rounded-lg cursor-pointer border px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                    >
                        {cancelText}
                    </button>

                    <button
                        onClick={onConfirm}
                        className="rounded-lg cursor-pointer bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;