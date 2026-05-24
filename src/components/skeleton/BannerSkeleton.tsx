const BannerSkeleton = () => {
    return (
        <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            
            {/* TABLE HEADER */}
            <div className="grid grid-cols-5 gap-4 border-b border-gray-200 bg-gray-50 px-6 py-4">
                {[...Array(15)].map((_, index) => (
                    <div
                        key={index}
                        className="h-4 animate-pulse rounded bg-gray-200"
                    />
                ))}
            </div>

            {/* TABLE BODY */}
            {[...Array(16)].map((_, rowIndex) => (
                <div
                    key={rowIndex}
                    className="grid grid-cols-5 gap-4 border-b border-gray-100 px-6 py-5"
                >
                    {[...Array(15)].map((_, colIndex) => (
                        <div
                            key={colIndex}
                            className="h-4 animate-pulse rounded bg-gray-200"
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default BannerSkeleton;