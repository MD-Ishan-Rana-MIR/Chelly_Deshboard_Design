import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
const baseUrl = import.meta.env.VITE_API_BASE_URL;
export const baseApi = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/`,

    prepareHeaders: (headers) => {
      const token = Cookies.get("token");

      headers.set("Accept", "application/json");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),

  tagTypes: ["Auth","Banner","Offer","Category"],
  endpoints: () => ({}),
});