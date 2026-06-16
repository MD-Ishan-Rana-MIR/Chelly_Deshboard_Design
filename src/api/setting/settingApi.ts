import { baseApi } from "../../router/base-api/baseApi";

export const settingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    storeSettingPage: builder.mutation({
      query: (payload) => ({
        url: `/admin/settings`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Setting"],
    }),
    getSettingPage: builder.query({
      query: (pageName) => ({
        url: `/settings/${pageName}`,
        method: "GET",
      }),
      providesTags: ["Setting"],
    }),
    postContactInformation: builder.mutation({
      query: (form) => ({
        url: `/admin/settings`,
        method: "POST",
        body: form,
      }),
      invalidatesTags: ["Setting"],
    }),
    getAllContactInformation: builder.query({
      query: () => ({
        url: `/admin/settings`,
      }),
      providesTags : ["Setting"]
    }),
  }),
});

export const {
  useStoreSettingPageMutation,
  useGetSettingPageQuery,
  usePostContactInformationMutation,
  useGetAllContactInformationQuery
} = settingApi;
