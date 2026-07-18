import { apiSlice } from "../apiSlice";

export const adApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPublishedAds: builder.query({
      query: (params) => ({ url: "/api/ads/my-ads", method: "GET", params }),
      providesTags: ["Ad"],
    }),

    getAllAds: builder.query({
      query: (params) => ({ url: "/api/ads/list", method: "GET", params: { type: "active", ...params } }),
      providesTags: ["Ad"],
    }),

    getGuestExploreAds: builder.query({
      query: (params = {}) => {
        const { type = "active", ...restParams } = params;
        return {
          url: "/api/ads/list",
          method: "GET",
          params: { type, ...restParams },
        };
      },
      providesTags: ["Ad"],
    }),

    getAdById: builder.query({
      query: (id) => ({ url: `/api/ads/details/${id}`, method: "GET" }),
      providesTags: (result, error, id) => [{ type: "Ad", id }],
    }),

    createAd: builder.mutation({
      query: (body) => ({ url: "/api/ads/store", method: "POST", body }),
      invalidatesTags: ["Ad"],
    }),

    updateAd: builder.mutation({
      query: (data) => {
        const id = data instanceof FormData ? data.get("id") : data.id;
        if (data instanceof FormData) {
          if (!data.has("_method")) {
            data.append("_method", "PUT");
          }
          data.delete("id");
        }
        return {
          url: `/api/ads/update/${id}`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Ad"],
    }),
      getAdWinners: builder.query({
      query: (adId) => ({ url: `/api/ads/winners?ad_id=${adId}`, method: "GET" }),
      providesTags: ["Ad"],
    }),

    checkCouponPermission: builder.mutation({
      query: (body) => ({ url: "/api/ads/coupon-permission", method: "POST", body }),
    }),

    checkPartnerCode: builder.mutation({
      query: (body) => ({ url: "/api/ads/check-partner-code", method: "POST", body }),
    }),
  }),
});

export const {
  useGetPublishedAdsQuery,
  useGetAllAdsQuery,
  useGetGuestExploreAdsQuery,
  useGetAdByIdQuery,
  useCreateAdMutation,
  useUpdateAdMutation,
  useGetAdWinnersQuery,
  useCheckCouponPermissionMutation,
  useCheckPartnerCodeMutation,
} = adApi;
