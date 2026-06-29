import { apiSlice } from "@/redux/api/apiSlice";

export const commonApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getCountries: builder.query({
      query: () => "/api/countries",
      providesTags: ["Countries"],
    }),
    searchUsers: builder.query({
      query: (query) => `/api/user/search?query=${query}`,
      providesTags: ["Users"],
    }),
    submitSupportTicket: builder.mutation({
      query: (data) => ({
        url: "/api/support/ticket/store",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useGetCountriesQuery, useLazySearchUsersQuery, useSubmitSupportTicketMutation } = commonApi;
