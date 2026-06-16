import { baseApi } from "../../router/base-api/baseApi";
// allBlogs

export const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allBlogs: builder.query({
      query: ({
        page = 1,
        per_page = 10,
        include = "category",
        search = "",
        status = "",
        title = "",
        category_id = "",
      }) => {
        // Initialize query params with flat variables
        const params = new URLSearchParams({
          page: String(page),
          per_page: String(per_page),
          include: String(include),
        });

        // Append complex nested query structural parameters safely
        params.append("filter[search]", search);
        params.append("filter[status]", status);
        params.append("filter[title]", title);
        params.append("filter[category_id]", String(category_id));

        return {
          url: "blogs",
          params: params,
        };
      },
      providesTags: ["Blog"],
    }),
    singleBlog: builder.query({
      query: (editId) => ({
        url: `/blogs/${editId}`,
        method: "get",
      }),
      providesTags: ["Blog"],
    }),
    postBlog: builder.mutation({
      query: (formData) => ({
        url: `/blogs`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Blog"],
    }),
    updateBlog: builder.mutation({
      query: ({ editId, formData }) => ({
        url: `/blogs/${editId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Blog"],
    }),
    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blog"],
    }),
  }),
});

export const {
  useAllBlogsQuery,
  useSingleBlogQuery,
  usePostBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApi;
