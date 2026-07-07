import { apiSlice } from "@/redux/api/apiSlice";

export const commonApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCountries: builder.query({
      query: () => "/api/countries",
      providesTags: ["Countries"],
    }),
    getCategories: builder.query({
      query: () => "/api/categories",
      providesTags: ["Categories"],
    }),
    searchUsers: builder.query({
      query: (query) => `/api/user/search?query=${query}`,
      providesTags: ["Users"],
    }),
    getAllUsers: builder.query({
      query: () => "/api/user/all-users",
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

export const {
  useGetCountriesQuery,
  useGetCategoriesQuery,
  useLazySearchUsersQuery,
  useGetAllUsersQuery,
  useSubmitSupportTicketMutation,
} = commonApi;
