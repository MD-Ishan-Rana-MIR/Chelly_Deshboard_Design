
interface PaginationProps {
    currentPage: number;
    lastPage: number;
    totalResults: number;
    perPage: number;
    isFetching?: boolean;
    onPageChange: (page: number) => void;
    onPerPageChange: (perPage: number) => void;
    perPageOptions?: number[];
}

export default function Pagination({
    currentPage,
    lastPage,
    totalResults,
    perPage,
    isFetching = false,
    onPageChange,
    onPerPageChange,
    perPageOptions = [5, 10, 20, 50],
}: PaginationProps) {


    if (totalResults === 0) return null;

    return (
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-gray-200 bg-white px-4 py-4 rounded-3xl shadow-sm sm:px-6">

            {/* Rows Per Page Selector */}
            <div className="flex items-center gap-2 justify-between sm:justify-start">
                <span className="text-sm text-gray-500">Rows per page:</span>
                <select
                    value={perPage}
                    disabled={isFetching}
                    onChange={(e) => {
                        onPerPageChange(Number(e.target.value));
                        onPageChange(1); // Safely reset to page 1 on depth limit changes
                    }}
                    className="rounded-xl border border-gray-300 px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-[#207F36] disabled:opacity-50"
                >
                    {perPageOptions.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <p className="text-sm text-gray-400 hidden md:block ml-2">
                    Total Results: <span className="font-medium text-gray-700">{totalResults}</span>
                </p>
            </div>

            {/* Mobile Navigation Layout */}
            <div className="flex flex-1 justify-between sm:hidden">
                <button
                    disabled={currentPage <= 1 || isFetching}
                    onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                    className="relative inline-flex items-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
                >
                    Previous
                </button>
                <button
                    disabled={currentPage >= lastPage || isFetching}
                    onClick={() => onPageChange(Math.min(currentPage + 1, lastPage))}
                    className="relative ml-3 inline-flex items-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
                >
                    Next
                </button>
            </div>

            {/* Desktop Navigation Layout */}
            <div className="hidden sm:flex sm:items-center sm:justify-between gap-6">
                <div>
                    <p className="text-sm text-gray-700">
                        Showing page <span className="font-semibold">{currentPage}</span> of{' '}
                        <span className="font-semibold">{lastPage}</span>
                    </p>
                </div>

                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md gap-1" aria-label="Pagination">
                        <button
                            disabled={currentPage <= 1 || isFetching}
                            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                            className="relative inline-flex items-center rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
                        >
                            &laquo; Prev
                        </button>

                        {Array.from({ length: lastPage }, (_, index) => {
                            const pageNum = index + 1;
                            return (
                                <button
                                    key={pageNum}
                                    disabled={isFetching}
                                    onClick={() => onPageChange(pageNum)}
                                    className={`relative inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold cursor-pointer ${currentPage === pageNum
                                            ? 'bg-[#207F36] text-white'
                                            : 'text-gray-900 border border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        <button
                            disabled={currentPage >= lastPage || isFetching}
                            onClick={() => onPageChange(Math.min(currentPage + 1, lastPage))}
                            className="relative inline-flex items-center rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
                        >
                            Next &raquo;
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
}