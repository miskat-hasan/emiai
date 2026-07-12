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
          per_page: 9,
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
    createDeal: builder.mutation({
      query: data => ({
        method: "POST",
        url: "/api/deals/store",
        body: data,
      }),
      invalidatesTags: ["Deals"],
    }),
  }),
});

export const {
  useGetDealsQuery,
  useGetDealDetailsQuery,
  useCreateDealMutation,
} = dealApi;
