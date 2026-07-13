import { apiSlice } from "../apiSlice";

export const contestApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getMyContests: builder.query({
      query: (params = {}) => ({
        url: "/api/contest/my-contests",
        method: "GET",
        params,
      }),
      providesTags: ["Contest"],
    }),

    getAllContests: builder.query({
      query: (params = {}) => ({
        url: "/api/contest",
        method: "GET",
        params,
      }),
      providesTags: ["Contest"],
    }),

    getParticipatedContests: builder.query({
      query: (params = {}) => ({
        url: "/api/contest/participated-contests",
        method: "GET",
        params,
      }),
      providesTags: ["Contest"],
    }),

    getSingleContest: builder.query({
      query: id => ({ url: `/api/contest/show?id=${id}`, method: "GET" }),
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

    updateContest: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/api/contest/update?id=${id}`,
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
    }),
  }),
});

export const {
  useGetMyContestsQuery,
  useGetAllContestsQuery,
  useGetParticipatedContestsQuery,
  useGetSingleContestQuery,
  useCreateContestMutation,
  useUpdateContestMutation,
  useAnnounceWinnerMutation,
  useJoinContestMutation,
} = contestApi;
