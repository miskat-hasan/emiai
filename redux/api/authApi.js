// redux/api/authApi.js
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
        url: "/api/users/register",
        method: "POST",
        body,
      }),
    }),

    verifyRegistrationOtp: builder.mutation({
      query: body => ({
        url: "/api/users/register/otp-verify",
        method: "POST",
        body,
      }),
    }),

    resendRegistrationOtp: builder.mutation({
      query: body => ({
        url: "/api/users/register/otp-resend",
        method: "POST",
        body,
      }),
    }),

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

    forgotPassword: builder.mutation({
      query: body => ({
        url: "/api/users/register/forgot-password",
        method: "POST",
        body,
      }),
    }),

    verifyOtp: builder.mutation({
      query: body => ({
        url: "/api/users/register/verify-forgot-password-otp",
        method: "POST",
        body,
      }),
    }),

    resendOtp: builder.mutation({
      query: body => ({
        url: "/api/users/register/resend-forgot-password-otp",
        method: "POST",
        body,
      }),
    }),

    resetPassword: builder.mutation({
      query: body => ({
        url: "/api/users/register/reset-password",
        method: "POST",
        body,
      }),
    }),

    socialLogin: builder.mutation({
      // body: { token, provider, username, email, avatar }
      query: body => ({
        url: "/api/social-login",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useVerifyRegistrationOtpMutation,
  useResendRegistrationOtpMutation,
  useGetMeQuery,
  useLogoutUserMutation,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useResetPasswordMutation,
  useSocialLoginMutation,
} = authApi;
