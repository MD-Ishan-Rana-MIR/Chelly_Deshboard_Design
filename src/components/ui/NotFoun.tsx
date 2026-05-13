
import { FiHome, FiAlertTriangle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

            <div className="text-center max-w-md">

                {/* ICON */}
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-red-100 flex items-center justify-center">
                        <FiAlertTriangle className="text-red-500 text-3xl" />
                    </div>
                </div>

                {/* TITLE */}
                <h1 className="text-5xl font-bold text-gray-800">
                    404
                </h1>

                <h2 className="text-2xl font-semibold mt-3 text-gray-700">
                    Page Not Found
                </h2>

                <p className="text-gray-500 mt-3">
                    Sorry, the page you are looking for doesn’t exist or has been moved.
                </p>

                {/* BUTTON */}
                <Link
                    to="/admin-dashboard"
                    className="mt-6 inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-semibold transition"
                >
                    <FiHome />
                    Back to Home
                </Link>

            </div>

        </div>
    );
}