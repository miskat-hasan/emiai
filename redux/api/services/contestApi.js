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
      query: () => ({
        url: "/api/contest/participated-contests",
        method: "GET",
      }),
      providesTags: ["Contest"],
    }),

    getSingleContest: builder.query({
      query: id => ({ url: `/api/contest/show?id=${id}`, method: "GET" }),
      providesTags: ["Contest"],
      // providesTags: (result, error, id) => [{ type: "Contest", id }],
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

    announceWinner: builder.mutation({
      query: body => ({
        url: "/api/contest/announce-winner",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Contest"],
    }),

    joinContest: builder.mutation({
      query: id => ({
        url: `/api/contest/join-contest?contest_id=${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Contest"],
      // invalidatesTags: (result, error, contestId) => [
      //   "Contest",
      //   { type: "Contest", id: contestId },
      // ],
    }),
  }),
});

export const {
  useGetMyContestsQuery,
  useGetAllContestsQuery,
  useGetParticipatedContestsQuery,
  useGetSingleContestQuery,
  useCreateContestMutation,
  useAnnounceWinnerMutation,
  useJoinContestMutation,
} = contestApi;
