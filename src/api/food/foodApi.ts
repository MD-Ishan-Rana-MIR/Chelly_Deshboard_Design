import { baseApi } from "../../router/base-api/baseApi";

// category,variants,variantsCounts

export const foodApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFoods: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();

        searchParams.append("include", "category,variants,variantsCount");

        if (params.page) {
          searchParams.append("page", String(params.page));
        }

        if (params.per_page) {
          searchParams.append("per_page", String(params.per_page));
        }

        if (params.search) {
          searchParams.append("filter[search]", params.search);
        }

        if (params.name) {
          searchParams.append("filter[name]", params.name);
        }

        if (params.category_id) {
          searchParams.append(
            "filter[category_id]",
            String(params.category_id),
          );
        }

        if (params.status) {
          searchParams.append("filter[status]", params.status);
        }

        return {
          url: `/foods?${searchParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Food"],
    }),
    getFoodById: builder.query({
      query: (id) => ({
        url: `/foods/${id}`,
        method: "GET",
      }),
      providesTags: ["Food"],
    }),
    uploadFood: builder.mutation({
      query: (formData) => ({
        url: "/foods",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Food"],
    }),
    deleteFood: builder.mutation({
      query: (deleteId) => ({
        url: `/foods/${deleteId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Food"],
    }),
    foodUpdate: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/foods/${id}`,
        method: "POST", // Needs to be POST because PHP doesn't parse multipart/form-data on PUT. Form uses _method: PUT.
        body: formData,
      }),
      invalidatesTags: ["Food"],
    }),
  }),
  overrideExisting: false,
});

// 3. Export the auto-generated query hook
export const {
  useGetFoodsQuery,
  useGetFoodByIdQuery,
  useUploadFoodMutation,
  useDeleteFoodMutation,
  useFoodUpdateMutation,
} = foodApi;
