import { baseApi } from "../../router/base-api/baseApi";

export const ebtPackageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allEbtPackages: builder.query({
      query: () => ({
        url: `/admin/ebt-packages`,
        method: "get",
      }),
      providesTags: ["EbtPackage"],
    }),

    addEbtPackage: builder.mutation({
      query: (data) => ({
        url: `/admin/ebt-packages`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["EbtPackage"],
    }),

    updateEbtPackage: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/ebt-packages/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["EbtPackage"],
    }),

    deleteEbtPackage: builder.mutation({
      query: (deleteId) => ({
        url: `/admin/ebt-packages/${deleteId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["EbtPackage"],
    }),
  }),
});

export const {
  useAllEbtPackagesQuery,
  useAddEbtPackageMutation,
  useUpdateEbtPackageMutation,
  useDeleteEbtPackageMutation,
} = ebtPackageApi;
