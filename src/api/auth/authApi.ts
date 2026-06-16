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
      providesTags: ["Auth"],
    }),
    emailVerify: builder.mutation({
      query: (data) => ({
        url: `/auth/forgot-password`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),
    otpVerify: builder.mutation({
      query: (payload) => ({
        url: `/auth/verify-password-otp`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Auth"],
    }),
    adminProfileUpdate: builder.mutation({
      query: (formData) => ({
        url: `/profile/update`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useAdminProfileQuery,
  useEmailVerifyMutation,
  useOtpVerifyMutation,
  useAdminProfileUpdateMutation
} = authApi;
