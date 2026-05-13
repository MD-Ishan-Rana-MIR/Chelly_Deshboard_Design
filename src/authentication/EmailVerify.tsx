import { useForm } from "react-hook-form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { useNavigate } from "react-router-dom";

type LoginFormValues = {
    email: string;
};

const EmailVerify = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>();

    const navigate = useNavigate();

    const onSubmit = async (data: LoginFormValues) => {
        console.log("Form Data:", data);
        navigate("/otp-verify");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b7211] to-[#0a4f90] px-5">

            {/* Card */}
            <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">

                {/* Title */}
                <h1 className="text-3xl font-bold text-center text-zinc-800">
                    Reset Password
                </h1>

                <p className="text-center text-zinc-500 mt-2 text-sm leading-6">
                    We’ll send a verification code to your email address
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">

                    {/* Email */}
                    <div>
                        <Label className="text-zinc-700 font-medium">
                            Email Address
                        </Label>

                        <Input
                            type="email"
                            placeholder="Enter your email"
                            className="mt-2 px-4 py-3 rounded-xl border border-zinc-200 focus:border-green-600 outline-none"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Enter a valid email",
                                },
                            })}
                        />

                        {errors.email && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Button */}
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#0b7211] hover:bg-[#09590e] text-white rounded-xl font-semibold"
                    >
                        {isSubmitting ? "Sending..." : "Continue"}
                    </Button>

                </form>

                {/* Footer text */}
                <p className="text-center text-xs text-zinc-400 mt-6">
                    Secure password reset for your account
                </p>

            </div>
        </div>
    );
};

export default EmailVerify;