import { baseApi } from "../../router/base-api/baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allUser: builder.query({
      query: () => ({
        url: `/admin/users`,
        method: "get",
      }),
      providesTags: ["User"],
    }),

    deleteUser: builder.mutation({
      query: (deleteId) => ({
        url: `/admin/users/${deleteId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    userToggle: builder.mutation({
      query: (id) => ({
        url: `/admin/users/${id}/toggle-status`,
        method: "PUT",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useAllUserQuery, useDeleteUserMutation, useUserToggleMutation } =
  userApi;
