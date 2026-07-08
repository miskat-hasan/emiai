import { apiSlice } from "@/redux/api/apiSlice";

export const dealApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getDeals: builder.query({
      query: () => ({
        method: "GET",
        url: `/api/deals`,
      }),
      providesTags: ["deals"],
    }),
  }),
});

export const { useGetDealsQuery } = dealApi;
