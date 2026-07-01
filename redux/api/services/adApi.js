import { apiSlice } from "../apiSlice";

export const adApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPublishedAds: builder.query({
      query: () => ({ url: "/api/ads/my-ads", method: "GET" }),
      providesTags: ["Ad"],
    }),

    getAllAds: builder.query({
      query: () => ({ url: "/api/ads/list?type=active", method: "GET" }),
      providesTags: ["Ad"],
    }),

    getGuestExploreAds: builder.query({
      query: (type = "all") => ({ url: `/api/ads/list?type=${type}`, method: "GET" }),
      providesTags: ["Ad"],
    }),

    getAdById: builder.query({
      query: (id) => ({ url: `/api/ads/${id}`, method: "GET" }),
      providesTags: (result, error, id) => [{ type: "Ad", id }],
    }),

    createAd: builder.mutation({
      query: (body) => ({ url: "/api/ads/store", method: "POST", body }),
      invalidatesTags: ["Ad"],
    }),
  }),
});

export const {
  useGetPublishedAdsQuery,
  useGetAllAdsQuery,
  useGetGuestExploreAdsQuery,
  useGetAdByIdQuery,
  useCreateAdMutation,
} = adApi;
