// redux/api/services/commonApi.js
import { apiSlice } from "@/redux/api/apiSlice";

export const commonApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getCountries: builder.query({
      query: () => "/api/countries",
      providesTags: ["Countries"],
    }),
    getCategories: builder.query({
      query: () => "/api/categories",
      providesTags: ["Categories"],
    }),

    submitSupportTicket: builder.mutation({
      query: data => ({
        url: "/api/support/ticket/store",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetCountriesQuery,
  useGetCategoriesQuery,
  useSubmitSupportTicketMutation,
} = commonApi;
