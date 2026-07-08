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
    searchUsers: builder.query({
      query: query => `/api/user/search?query=${query}`,
      providesTags: ["Users"],
    }),
    getAllUsers: builder.query({
      query: () => ({ url: "/api/user/all-users", method: "GET" }),
      providesTags: ["Users"],
    }),
    submitSupportTicket: builder.mutation({
      query: data => ({
        url: "/api/support/ticket/store",
        method: "POST",
        body: data,
      }),
    }),

    // TODO: swap in the real endpoint once it exists on the backend
    updateOnboardingCategory: builder.mutation({
      query: body => ({
        url: "/api/user/update-onboarding-category",
        method: "POST",
        body,
      }),
    }),

    // TODO: swap in the real endpoint — expected to accept
    // { platform, code, redirect_uri } and return the connected
    // account's username/handle after exchanging the OAuth code
    connectSocialAccount: builder.mutation({
      query: body => ({
        url: "/api/user/social/connect",
        method: "POST",
        body,
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
  useUpdateOnboardingCategoryMutation,
  useConnectSocialAccountMutation,
} = commonApi;
