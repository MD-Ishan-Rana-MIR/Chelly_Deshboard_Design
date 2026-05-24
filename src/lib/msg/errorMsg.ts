import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import toast from "react-hot-toast";

export const errorMessage = (err: FetchBaseQueryError | unknown) => {
    const error = err as FetchBaseQueryError & {
        data?: { message?: string };
    };

    toast.error(error.data?.message || "Something went wrong ❌");
}