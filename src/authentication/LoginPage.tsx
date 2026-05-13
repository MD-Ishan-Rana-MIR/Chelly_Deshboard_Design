import { useForm } from "react-hook-form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Link, useNavigate } from "react-router-dom";

type LoginFormValues = {
    email: string;
    password: string;
};

const LoginPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>();

    const navigate = useNavigate();

    const onSubmit = async (data: LoginFormValues) => {
        console.log("Form Data:", data);
        navigate("/admin-dashboard");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b7211] via-[#0a4f90] to-[#0b1b3a] px-4">
            <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8">

                {/* Title */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white">
                        Admin Portal
                    </h1>
                    <p className="text-sm text-white/70 mt-2">
                        Secure access to your dashboard
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    {/* Email */}
                    <div className="space-y-2">
                        <Label className="text-white">Email</Label>
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            className="bg-white/10 text-white placeholder:text-white/50 border-white/20 focus:ring-2 focus:ring-white/40"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Enter a valid email",
                                },
                            })}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-300">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <Label className="text-white">Password</Label>
                        <Input
                            type="password"
                            placeholder="Enter your password"
                            className="bg-white/10 text-white placeholder:text-white/50 border-white/20 focus:ring-2 focus:ring-white/40"
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Minimum 6 characters required",
                                },
                            })}
                        />
                        {errors.password && (
                            <p className="text-sm text-red-300">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Button */}
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-white text-black font-semibold text-sm  rounded-xl hover:bg-gray-200 transition"
                    >
                        {isSubmitting ? "Logging in..." : "Login"}
                    </Button>

                    {/* Forgot Password */}
                    <div className="text-center">
                        <Link
                            to={"/email-verify"}
                            className="text-sm text-white/70 hover:text-white transition"
                        >
                            Forgot Password?
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;