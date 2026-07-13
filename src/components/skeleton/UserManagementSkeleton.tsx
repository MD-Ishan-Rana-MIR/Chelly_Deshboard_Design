
export default function UserManagementSkeleton() {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">

            {/* HEADER */}
            <div className="mb-6">
                <div className="h-8 w-60 bg-gray-200 rounded-md mb-3" />
                <div className="h-4 w-80 bg-gray-100 rounded-md" />
            </div>

            {/* FILTER BAR */}
            <div className="flex flex-col md:flex-row gap-3 mb-5">

                {/* SEARCH */}
                <div className="w-full h-12 bg-gray-100 rounded-xl" />

                {/* STATUS FILTER */}
                <div className="w-full md:w-48 h-12 bg-gray-100 rounded-xl" />

            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
                <table className="min-w-full">

                    {/* TABLE HEADER */}
                    <thead>
                        <tr className="bg-gray-100">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
                                <th key={item} className="px-6 py-4">
                                    <div className="h-4 w-20 bg-gray-200 rounded" />
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* TABLE BODY */}
                    <tbody>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((row) => (
                            <tr key={row} className="border-b">

                                {/* ID */}
                                <td className="px-6 py-5">
                                    <div className="h-4 w-20 bg-gray-100 rounded" />
                                </td>

                                {/* NAME */}
                                <td className="px-6 py-5">
                                    <div className="h-4 w-32 bg-gray-200 rounded" />
                                </td>

                                {/* EMAIL */}
                                <td className="px-6 py-5">
                                    <div className="h-4 w-44 bg-gray-100 rounded" />
                                </td>

                                {/* STATUS */}
                                <td className="px-6 py-5">
                                    <div className="h-7 w-20 bg-gray-200 rounded-full" />
                                </td>

                                {/* ACTIONS */}
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-gray-100 rounded-full" />
                                        <div className="w-9 h-9 bg-gray-100 rounded-full" />
                                        <div className="w-9 h-9 bg-gray-100 rounded-full" />
                                    </div>
                                </td>

                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>

        </div>
    );
}