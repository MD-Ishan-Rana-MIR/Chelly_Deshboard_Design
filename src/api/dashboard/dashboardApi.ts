import { baseApi } from "../../router/base-api/baseApi";

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    dashboardStatas: builder.query({
      query: () => ({
        url: `/admin/dashboard`,
        method : "GET"
      }),
    }),
  }),
});

export const { useDashboardStatasQuery } = categoryApi;
