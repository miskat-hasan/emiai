// redux/api/services/smartFeedApi.js
import { apiSlice } from "../apiSlice";

const SmartFeedApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getSmartFeedSuggestion: builder.mutation({
      query: data => ({
        url: "/api/smart-feed/suggest",
        method: "POST",
        body: data, // { goal, message }
      }),
    }),
    getSmartFeedHistory: builder.query({
      query: (page = 1) => ({
        url: "/api/smart-feed/history",
        method: "GET",
        params: { page },
      }),
    }),
  }),
});

export const {
  useGetSmartFeedSuggestionMutation,
  useGetSmartFeedHistoryQuery,
} = SmartFeedApi;
