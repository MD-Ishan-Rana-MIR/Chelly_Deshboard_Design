import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

type FormValues = {
    otp: string[];
};

const OtpVerify = () => {
    const {
        handleSubmit,
        setValue,
        formState: { isSubmitting },
    } = useForm<FormValues>({
        defaultValues: {
            otp: ["", "", "", "", "", ""],
        },
    });

    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
    const navigate = useNavigate();

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number
    ) => {
        const value = e.target.value.replace(/\D/g, "");
        if (!value) return;

        setValue(`otp.${index}`, value);

        if (index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        index: number
    ) => {
        if (e.key === "Backspace") {
            setValue(`otp.${index}`, "");
            if (index > 0) {
                inputsRef.current[index - 1]?.focus();
            }
        }
    };

    const onSubmit = (data: FormValues) => {
        const finalOtp = data.otp.join("");
        console.log("Submitted OTP:", finalOtp);
        navigate("/change-password");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b7211] to-[#0a4f90] px-5">

            {/* Card */}
            <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">

                {/* Title */}
                <h1 className="text-3xl font-bold text-center text-zinc-800">
                    Verify Identity
                </h1>

                <p className="text-center text-zinc-500 mt-2 text-sm">
                    Enter the 6-digit code sent to your email
                </p>

                {/* OTP Inputs */}
                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">

                    <div className="flex justify-between gap-2">
                        {[...Array(6)].map((_, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength={1}
                                className="
                                    w-12 h-12 md:w-14 md:h-14
                                    text-center text-lg font-semibold
                                    border border-zinc-200
                                    rounded-xl
                                    focus:border-green-600
                                    outline-none
                                "
                                onChange={(e) => handleChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                ref={(el) => {
                                    inputsRef.current[index] = el;
                                }}
                            />
                        ))}
                    </div>

                    {/* Button */}
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#0b7211] hover:bg-[#09590e] text-white py-3 rounded-xl font-semibold"
                    >
                        {isSubmitting ? "Verifying..." : "Verify OTP"}
                    </Button>

                    {/* Resend */}
                    <p className="text-center text-sm text-zinc-500">
                        Didn’t receive the code?{" "}
                        <button
                            type="button"
                            className="text-green-700 font-medium hover:underline"
                        >
                            Resend
                        </button>
                    </p>

                </form>

            </div>
        </div>
    );
};

export default OtpVerify;