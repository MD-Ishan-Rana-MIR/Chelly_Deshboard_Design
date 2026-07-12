import { FiX } from 'react-icons/fi';
import type { FoodItem } from '../../lib/type/type';

interface FoodDetailsModalProps {
    food: FoodItem | null;
    onClose: () => void;
}

export default function FoodDetailsModal({ food, onClose }: FoodDetailsModalProps) {
    // Return null early if no item is selected to prevent open rendering artifacts
    if (!food) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 transition-opacity">
            <div className="bg-white w-full max-w-xl rounded-3xl overflow-hidden relative shadow-2xl max-h-[90vh] flex flex-col animate-scaleUp">

                {/* Modal Header Controls */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-black/40 text-white hover:bg-black/60 transition rounded-full cursor-pointer"
                    title="Close"
                >
                    <FiX size={18} />
                </button>

                {/* Top Banner Banner Media Section */}
                <div className="relative h-56 bg-gray-100 shrink-0">
                    <img
                        src={food.image}
                        alt={food.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-6 right-6">
                        <span className="px-2 py-1 rounded-md text-xs font-semibold bg-[#207F36] text-white tracking-wide uppercase">
                            {food.category?.name || "General Food"}
                        </span>
                        <h2 className="text-2xl font-bold text-white mt-1 drop-shadow-sm">{food.name}</h2>
                    </div>
                </div>

                {/* Modal Data Content Area */}
                <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-gray-600">

                    {/* Fast-Facts Metrics Grid */}
                    <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="bg-green-50/60 p-3 rounded-2xl border border-green-100">
                            <p className="text-xs text-gray-400 font-medium">Price</p>
                            <p className="text-base font-bold text-green-600 mt-0.5">
                                ${parseFloat(food.price).toFixed(2)}
                            </p>
                        </div>
                        <div className="bg-blue-50/60 p-3 rounded-2xl border border-blue-100">
                            <p className="text-xs text-gray-400 font-medium">Available Stock</p>
                            <p className="text-base font-bold text-blue-600 mt-0.5">{food.stock} units</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                            <p className="text-xs text-gray-400 font-medium">Status</p>
                            <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold uppercase ${food.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                                }`}>
                                {food.status}
                            </span>
                        </div>
                        <div className="bg-green-50/60 p-3 rounded-2xl border border-green-100">
                            <p className="text-xs text-gray-400 font-medium">Total Variant</p>
                            <p className="text-base font-bold text-green-600 mt-0.5">
                                {
                                    food?.variants?.length
                                }
                            </p>
                        </div>
                    </div>
                    

                    {/* Rich HTML WYSIWYG Content Processor */}
                    <div>
                        <h4 className="text-xs uppercase tracking-wider font-semibold text-gray-400 mb-2">Product Description</h4>
                        <div
                            className="prose prose-sm text-gray-600 space-y-2 bg-gray-50 p-4 rounded-2xl border border-gray-100 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: food.description }}
                        />
                    </div>

                    {/* Metadata Trace Audit logs */}
                    <div className="pt-2 border-t border-gray-100 text-xs text-gray-400 flex justify-between">
                        <p>Created: {new Date(food.created_at).toLocaleDateString()}</p>
                        <p>Last Sync: {new Date(food.updated_at).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Bottom Action Footer Bar */}
                <div className="p-4 bg-gray-50 border-t flex justify-end gap-2 shrink-0">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-800 cursor-pointer transition rounded-xl"
                    >
                        Close View
                    </button>
                </div>

            </div>
        </div>
    );
}