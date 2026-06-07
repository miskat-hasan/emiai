import { apiSlice } from "../apiSlice";

export const contestApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getMyContests: builder.query({
      query: () => ({ url: "/api/contest/my-contests", method: "GET" }),
      providesTags: ["Contest"],
    }),

    getAllContests: builder.query({
      query: () => ({ url: "/api/contest", method: "GET" }),
      providesTags: ["Contest"],
    }),

    getParticipatedContests: builder.query({
      query: () => ({ url: "/api/contest/participated", method: "GET" }),
      providesTags: ["Contest"],
    }),

    createContest: builder.mutation({
      query: formData => ({
        url: "/api/contest/store",
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: ["Contest"],
    }),
  }),
});

export const {
  useGetMyContestsQuery,
  useGetAllContestsQuery,
  useGetParticipatedContestsQuery,
  useCreateContestMutation,
} = contestApi;
