import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const baseApi = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}`,

    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      const reset_token = localStorage.getItem("reset_token");

      headers.set("Accept", "application/json");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      if (reset_token) {
        headers.set("Authorization", `Bearer ${reset_token}`);
      }

      return headers;
    },
  }),

  tagTypes: ["Auth", "Banner", "Offer", "Category", "User", "Blog","Setting","Order","Food","Notification","Collection", "EbtPackage"],
  endpoints: () => ({}),
});
