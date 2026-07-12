import { apiSlice } from "@/redux/api/apiSlice";

export const socialApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getSocialStatus: builder.query({
      query: platform => `/api/v1/auth/${platform}/status`,
      providesTags: (result, error, platform) => [
        { type: "SocialStatus", id: platform },
      ],
    }),
    connectSocialAccount: builder.mutation({
      // body: { code, redirect_uri }
      query: ({ platform, code, redirect_uri }) => ({
        url: `/api/v1/auth/${platform}/callback`,
        method: "POST",
        body: { code, redirect_uri },
      }),
      invalidatesTags: (result, error, { platform }) => [
        { type: "SocialStatus", id: platform },
      ],
    }),
    disconnectSocialAccount: builder.mutation({
      query: platform => ({
        url: `/api/v1/auth/${platform}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, platform) => [
        { type: "SocialStatus", id: platform },
      ],
    }),
  }),
});

export const {
  useGetSocialStatusQuery,
  useConnectSocialAccountMutation,
  useDisconnectSocialAccountMutation,
} = socialApi;
