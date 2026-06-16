import { baseApi } from "../../router/base-api/baseApi";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allOrder: builder.query({
      query: ({
        statusFilter,
        searchId,
        searchCustomer,
        searchFood,
        page = 1,
        perPage,
      }) => {
        console.log("statusFilter", statusFilter);
        let url = "/admin/orders?";
        const params = [];

        // Add pagination and per_page parameters
        params.push(`page=${page}`);
        params.push(`per_page=${perPage}`);

        // Filter params
        if (statusFilter && statusFilter !== "All Order Status") {
          params.push(`filter[status]=${statusFilter.toLowerCase()}`);
        }
        if (searchId) {
          params.push(`filter[order_number]=${searchId}`);
        }
        if (searchCustomer) {
          params.push(`filter[customer]=${searchCustomer}`);
        }
        if (searchFood) {
          params.push(`filter[food]=${searchFood}`);
        }

        url += params.join("&");

        return {
          url: url,
          method: "GET",
        };
      },
      providesTags: ["Order"],
    }),
    orderStatusUpdate: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/admin/orders/${id}/status`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags : ["Order"]
    }),
  }),
});

export const { useAllOrderQuery , useOrderStatusUpdateMutation} = orderApi;
