import { apiSlice } from "../apiSlice";

export const adApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getPublishedAds: builder.query({
      query: () => ({ url: "/api/ads", method: "GET" }),
      providesTags: ["Ad"],
    }),

    getAdById: builder.query({
      query: id => ({ url: `/api/ads/${id}`, method: "GET" }),
      providesTags: (result, error, id) => [{ type: "Ad", id }],
    }),

    createAd: builder.mutation({
      query: body => ({ url: "/api/ads", method: "POST", body }),
      invalidatesTags: ["Ad"],
    }),
  }),
});

export const {
  useGetPublishedAdsQuery,
  useGetAdByIdQuery,
  useCreateAdMutation,
} = adApi;

