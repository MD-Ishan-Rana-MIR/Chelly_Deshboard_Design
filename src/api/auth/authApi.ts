import { baseApi } from "../../router/base-api/baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),
    adminProfile: builder.query({
      query: () => ({
        url: `/profile/me`,

      }),
      providesTags : ["Auth"]
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation,useAdminProfileQuery } = authApi;
