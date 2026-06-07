// import { apiSlice } from "./apiSlice";

// export const authApi = apiSlice.injectEndpoints({
//   endpoints: builder => ({
//     loginUser: builder.mutation({
//       query: body => ({
//         url: "/api/users/login",
//         method: "POST",
//         body,
//       }),
//       invalidatesTags: ["User"],
//     }),

//     registerUser: builder.mutation({
//       query: body => ({
//         url: "/api/users/register",
//         method: "POST",
//         body,
//       }),
//     }),

//     logoutUser: builder.mutation({
//       query: () => ({
//         url: "/api/users/logout",
//         method: "POST",
//       }),
//       invalidatesTags: ["User"],
//     }),
//   }),
// });

// export const {
//   useLoginUserMutation,
//   useRegisterUserMutation,
//   useLogoutUserMutation,
// } = authApi;

import { apiSlice } from "./apiSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    loginUser: builder.mutation({
      query: body => ({
        url: "/api/users/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    registerUser: builder.mutation({
      query: body => ({
        url: "/api/register",
        method: "POST",
        body,
      }),
    }),

    // Fetches fresh user data from the server using the stored token
    getMe: builder.query({
      query: () => ({
        url: "/api/user",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    logoutUser: builder.mutation({
      query: () => ({
        url: "/api/users/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useGetMeQuery,
  useLogoutUserMutation,
} = authApi;