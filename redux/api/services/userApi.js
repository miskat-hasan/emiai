// redux/api/services/userApi.js
import { apiSlice } from "@/redux/api/apiSlice";

export const commonApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    searchUsers: builder.query({
      query: query => `/api/user/search?query=${query}`,
      providesTags: ["Users"],
    }),
    getAllUsers: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        if (params.role) searchParams.set("role", params.role);
        // if (params.per_page) searchParams.set("per_page", params.per_page);
        // if (params.page) searchParams.set("page", params.page);
        // if (params.type) searchParams.set("type", params.type);
        const qs = searchParams.toString();
        return {
          url: `/api/user/all-users${qs ? `?${qs}` : ""}`,
          method: "GET",
        };
      },
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
