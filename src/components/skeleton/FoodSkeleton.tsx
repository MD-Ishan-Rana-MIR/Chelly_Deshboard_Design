

export default function FoodSkeleton() {
    // Generate an array of placeholder rows to mirror your default 'per_page' limit context
    const placeholders = Array.from({ length: 5 });

    return (
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden animate-pulse">
            {/* Header Mirror Area */}
            <div className="p-5 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-6 w-28 bg-gray-200 rounded-lg" />
                    <div className="h-4 w-16 bg-gray-100 rounded-md" />
                </div>
                <div className="h-4 w-32 bg-gray-200 rounded-md" />
            </div>

            {/* Table Area */}
            <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                    <thead className="bg-gray-50">
                        <tr className="text-left text-sm text-gray-600">
                            <th className="p-4 font-semibold"><div className="h-4 w-12 bg-gray-200 rounded" /></th>
                            <th className="p-4 font-semibold"><div className="h-4 w-16 bg-gray-200 rounded" /></th>
                            <th className="p-4 font-semibold"><div className="h-4 w-10 bg-gray-200 rounded" /></th>
                            <th className="p-4 font-semibold"><div className="h-4 w-10 bg-gray-200 rounded" /></th>
                            <th className="p-4 font-semibold"><div className="h-4 w-14 bg-gray-200 rounded" /></th>
                            <th className="p-4 text-right font-semibold"><div className="h-4 w-12 ml-auto bg-gray-200 rounded" /></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {placeholders.map((_, index) => (
                            <tr key={index} className="bg-white">
                                {/* Food Item Meta Group */}
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-14 h-14 rounded-xl bg-gray-200 border shrink-0" />
                                        <div className="space-y-2 w-full">
                                            <div className="h-4 w-36 bg-gray-200 rounded-md" />
                                            <div className="h-3 w-16 bg-gray-100 rounded-md" />
                                        </div>
                                    </div>
                                </td>

                                {/* Category Badge */}
                                <td className="p-4">
                                    <div className="h-6 w-20 bg-gray-100 rounded-full" />
                                </td>

                                {/* Price Field */}
                                <td className="p-4">
                                    <div className="h-4 w-14 bg-gray-200 rounded-md" />
                                </td>

                                {/* Stock Tracker */}
                                <td className="p-4">
                                    <div className="h-4 w-10 bg-gray-200 rounded-md" />
                                </td>

                                {/* Status Token Badge */}
                                <td className="p-4">
                                    <div className="h-6 w-24 bg-gray-100 rounded-full" />
                                </td>

                                {/* Action Buttons Panel Container */}
                                <td className="p-4">
                                    <div className="flex justify-end gap-2">
                                        <div className="w-9 h-9 rounded-xl bg-gray-100" />
                                        <div className="w-9 h-9 rounded-xl bg-gray-100" />
                                        <div className="w-9 h-9 rounded-xl bg-gray-100" />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Segment Footer Mockup */}
            <div className="p-4 border-t flex items-center justify-between">
                <div className="h-4 w-40 bg-gray-200 rounded-md" />
                <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gray-100" />
                    <div className="w-8 h-8 rounded-lg bg-gray-100" />
                    <div className="w-8 h-8 rounded-lg bg-gray-100" />
                </div>
            </div>
        </div>
    );
}