// redux/api/services/userApi.js
import { apiSlice } from "@/redux/api/apiSlice";

export const commonApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    searchUsers: builder.query({
      query: query => `/api/user/search?query=${query}`,
      providesTags: ["Users"],
    }),
    getAllUsers: builder.query({
      query: () => ({ url: "/api/user/all-users", method: "GET" }),
      providesTags: ["Users"],
    }),
    updateUser: builder.mutation({
      query: body => ({
        url: "/api/user/update",
        method: "POST",
        body,
        formData: true,
      }),
      invalidatesTags: ["Users"],
    }),
    updatePassword: builder.mutation({
      query: body => ({
        url: "/api/user/update-password",
        method: "POST",
        body,
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
  }),
});

export const {
  useLazySearchUsersQuery,
  useGetAllUsersQuery,
  useUpdateUserMutation,
  useUpdatePasswordMutation,
  useUpdateOnboardingCategoryMutation,
} = commonApi;
