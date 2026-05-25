import { X } from "lucide-react";
import React from "react";

type ConfirmModalProps = {
    open: boolean;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    open,
    title = "Are you sure?",
    description = "Do you really want to continue this action?",
    confirmText = "Yes",
    cancelText = "Cancel",
    loading = false,
    onConfirm,
    onCancel,
}) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex h-screen items-center justify-center">
            {/* Overlay */}
            <div
                onClick={!loading ? onCancel : undefined}
                className="absolute inset-0 bg-black/50"
            />

            {/* Modal Box */}
            <div className="relative w-[90%] max-w-md rounded-2xl bg-white p-6 shadow-xl">
                {/* Close button */}
                <button
                    onClick={onCancel}
                    disabled={loading}
                    className="absolute right-3 top-3 cursor-pointer text-gray-500 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
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
                        disabled={loading}
                        className="rounded-lg border cursor-pointer px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {cancelText}
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`flex min-w-[120px] items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm text-white transition-all duration-300
                        ${loading
                                ? "cursor-not-allowed bg-red-400"
                                : "cursor-pointer bg-red-500 hover:bg-red-600"
                            }`}
                    >
                        {loading && (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        )}

                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;