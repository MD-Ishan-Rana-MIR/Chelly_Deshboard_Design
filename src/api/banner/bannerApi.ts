import { baseApi } from "../../router/base-api/baseApi";

export const bannerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allBanner : builder.query({
        query : ()=>({
            url : `/banners`,
            method : "GET"
        }),
        providesTags : ["Banner"]
    }),
    storeBanner : builder.mutation({
        query : (data)=>({
            url : `/banners`,
            method : "POST",
            body : data
        }),
        invalidatesTags : ["Banner"]
    }),
    bannerDelete : builder.mutation({
        query : (selectedDeleteId)=>({
            url : `/banners/${selectedDeleteId}`,
            method : "DELETE"
        }),
        invalidatesTags : ["Banner"]
    }),
    bannerUpdate : builder.mutation({
        query : ({editId,formData})=>({
            url : `/banners/${editId}`,
            method : "POST",
            body : formData
        }),
        invalidatesTags : ["Banner"]
    })
  }),
});

export const { useAllBannerQuery,useStoreBannerMutation, useBannerDeleteMutation,useBannerUpdateMutation  } =
  bannerApi;
