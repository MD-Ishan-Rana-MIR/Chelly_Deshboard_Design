import { useForm } from "react-hook-form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { useNavigate } from "react-router-dom";

type LoginFormValues = {
    newPassword: string;
    confirmPassword: string;
};

const ChangePassword = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>();

    const navigate = useNavigate();

    const password = watch("newPassword");

    const onSubmit = async (data: LoginFormValues) => {
        console.log("Form Data:", data);
        navigate("/");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b7211] to-[#0a4f90] px-5">

            {/* Card */}
            <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">

                {/* Title */}
                <h1 className="text-3xl font-bold text-center text-zinc-800">
                    New Password
                </h1>

                <p className="text-center text-zinc-500 mt-2 text-sm">
                    Create a strong and secure password
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">

                    {/* New Password */}
                    <div>
                        <Label className="text-zinc-700 font-medium">
                            New Password
                        </Label>

                        <Input
                            type="password"
                            placeholder="Enter new password"
                            className="mt-2 px-4 py-3 rounded-xl border border-zinc-200 focus:border-green-600 outline-none"
                            {...register("newPassword", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Minimum 6 characters required",
                                },
                            })}
                        />

                        {errors.newPassword && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.newPassword.message}
                            </p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <Label className="text-zinc-700 font-medium">
                            Confirm Password
                        </Label>

                        <Input
                            type="password"
                            placeholder="Confirm your password"
                            className="mt-2 px-4 py-3 rounded-xl border border-zinc-200 focus:border-green-600 outline-none"
                            {...register("confirmPassword", {
                                required: "Confirm your password",
                                validate: (value) =>
                                    value === password || "Passwords do not match",
                            })}
                        />

                        {errors.confirmPassword && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#0b7211] hover:bg-[#09590e] text-white py-3 rounded-xl font-semibold"
                    >
                        {isSubmitting ? "Updating..." : "Update Password"}
                    </Button>

                </form>

            </div>
        </div>
    );
};

export default ChangePassword;