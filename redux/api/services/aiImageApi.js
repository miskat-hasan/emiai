// redux/api/services/aiImageApi.js
import { apiSlice } from "../apiSlice";

const AiImageApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    generateImage: builder.mutation({
      query: prompt => ({
        url: "/api/ai/generate-image",
        method: "POST",
        body: { prompt },
      }),
    }),
    getImageHistory: builder.query({
      query: (page = 1) => ({
        url: "/api/ai/generate-image/history",
        method: "GET",
        params: { page },
      }),
    }),
  }),
});

export const { useGenerateImageMutation, useGetImageHistoryQuery } = AiImageApi;
