import { apiSlice } from "@/redux/api/apiSlice";

export const dealApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getDeals: builder.query({
      query: ({ page, status, search }) => ({
        method: "GET",
        url: `/api/deals`,
        params: {
          page,
          status,
          search,
          per_page: 1,
        },
      }),
      providesTags: ["Deals"],
    }),
    getDealDetails: builder.query({
      query: id => ({
        method: "GET",
        url: `/api/deals/show?id=${id}`,
      }),
      providesTags: ["Deals"],
    }),
  }),
});

export const { useGetDealsQuery, useGetDealDetailsQuery } = dealApi;
