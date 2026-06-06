import { apiSlice } from "./apiSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    loginUser: builder.mutation({
      query: body => ({
        url: "/login",
        method: "POST",
        body,
      }),

      invalidatesTags: ["User"],
    }),

    logoutUser: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),

      invalidatesTags: ["User"],
    }),
  }),
});

export const { useLoginUserMutation, useLogoutUserMutation } = authApi;
