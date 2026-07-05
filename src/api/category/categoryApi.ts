import { baseApi } from "../../router/base-api/baseApi";

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allCategory: builder.query({
      query: ({ page, per_page, include = "foods" }) => ({
        url: "categories",
        params: { page, per_page, include },
      }),
      providesTags: ["Category"],
    }),
    postCategory: builder.mutation({
      query: (formData) => ({
        url: `/categories`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Category"],
    }),
    updateCateotgry: builder.mutation({
      query: ({ editId, formData }) => ({
        url: `/categories/${editId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Category"],
    }),
    deleteCategory: builder.mutation({
      query: (deleteId) => ({
        url: `/categories/${deleteId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
    allCategoryWithOutPagination: builder.query({
      query: () => ({
        url: "/categories",
      }),
      providesTags: ["Category"],
    }),
  }),
});

export const {
  useAllCategoryQuery,
  usePostCategoryMutation,
  useUpdateCateotgryMutation,
  useDeleteCategoryMutation,
  useAllCategoryWithOutPaginationQuery,
} = categoryApi;
