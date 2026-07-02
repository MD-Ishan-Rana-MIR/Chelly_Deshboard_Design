import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
    const token = localStorage.getItem("token");

    // টোকেন না থাকলে লগইন পেজে রিডাইরেক্ট করবে
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // টোকেন থাকলে চাইল্ড রাউটগুলো (যেমন: ড্যাশবোর্ড) রেন্ডার করবে
    return <Outlet />;
}