import { useNavigate } from "react-router-dom";

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 py-24 text-center sm:py-32 lg:px-8">
            <div className="max-w-md">
                
                <p className="text-9xl font-black text-[#207F36] animate-pulse">404</p>

                <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    Page not found
                </h1>

                
                <p className="mt-6 text-base leading-7 text-gray-600">
                    Sorry, we couldn’t find the page you’re looking for. It might have been moved, deleted, or perhaps it never existed in this dimension.
                </p>

                
                <div className="mt-10 flex items-center justify-center gap-x-4">
                    
                    <button
                        onClick={() => navigate(-1)}
                        className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 active:scale-95 cursor-pointer"
                    >
                        ← Go Back
                    </button>

                    
                    <button
                        onClick={() => navigate("/admin-dashboard")}
                        className="rounded-xl bg-[#207F36] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#175c27] active:scale-95 cursor-pointer"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}