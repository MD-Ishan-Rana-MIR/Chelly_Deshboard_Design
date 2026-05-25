import { baseApi } from "../../router/base-api/baseApi";

export const offerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allOffer: builder.query({
      query: () => ({
        url: `/offers`,
        method: "get",
      }),
      providesTags: ["Offer"],
    }),
    postOffer: builder.mutation({
      query: (payload) => ({
        url: `/offers`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Offer"],
    }),
    updateOffer: builder.mutation({
      query: ({ editId, payload }) => ({
        url: `/offers/${editId}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Offer"],
    }),
    deleteOffer: builder.mutation({
      query: (deleteId) => ({
        url: `/offers/${deleteId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Offer"],
    }),
  }),
});

export const {
  useAllOfferQuery,
  usePostOfferMutation,
  useUpdateOfferMutation,
  useDeleteOfferMutation,
} = offerApi;
