import { baseApi } from "../../router/base-api/baseApi";

export const collectionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCollection: builder.query({
      query: () => ({
        url: `/collections`,
        method: "GET",
      }),
      providesTags: ["Collection"],
    }),
    createCollection: builder.mutation({
      query: (payload) => ({
        url: `/collections`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Collection"],
    }),
    updateCollection: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/collections/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Collection"],
    }),
    deleteCollection: builder.mutation({
      query: (id) => ({
        url: `/collections/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Collection"],
    }),
  }),
});

export const {
  useGetAllCollectionQuery,
  useCreateCollectionMutation,
  useUpdateCollectionMutation,
  useDeleteCollectionMutation
} = collectionApi;
