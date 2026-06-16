import { baseApi } from "../../router/base-api/baseApi";

export const foodApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFoods: builder.query({
      query: (params) => {
        console.log(" i am from api params",params)
        const searchParams = new URLSearchParams();

        searchParams.append("include", "category");
        if (params?.page) searchParams.append("page", params.page.toString());
        if (params?.per_page)
          searchParams.append("per_page", params.per_page.toString());
        console.log("params?.per_page",params?.per_page);

        // 2. Safely Loop through & format Nested Filters
        if (params?.search)
          searchParams.append("filter[search]", params.search);
        if (params?.name) searchParams.append("filter[name]", params.name);
        if (params?.category_id)
          searchParams.append(
            "filter[category_id]",
            params.category_id.toString(),
          );
        if (params?.status)
          searchParams.append("filter[status]", params.status);

        return {
          url: "/foods",
          method: "GET",
          params: searchParams,
        };
      },
      providesTags: ["Food"],
    }),
  }),
  overrideExisting: false,
});

// 3. Export the auto-generated query hook
export const { useGetFoodsQuery } = foodApi;
