import { apiSlice } from "@/redux/api/apiSlice";

export const managerApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getMyAgencies: builder.query({
      query: () => "/api/managers/my-agencies",
      providesTags: ["Agencies"],
    }),

    storeAgency: builder.mutation({
      query: body => ({
        url: "/api/managers/store-agency",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Agencies"],
    }),

    // TODO (fake endpoint): backend doesn't have a delete route yet.
    // This still fires a real DELETE call to a guessed URL so swapping in the
    // real endpoint later is a one-line change. The optimistic cache update
    // removes the row immediately regardless of the (currently 404) result —
    // once the real endpoint ships, delete the try/catch swallow below so
    // genuine failures roll the UI back instead of silently succeeding.
    deleteAgency: builder.mutation({
      query: agencyId => ({
        url: `/api/managers/agencies/${agencyId}`,
        method: "DELETE",
      }),
      async onQueryStarted(agencyId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          managerApi.util.updateQueryData("getMyAgencies", undefined, draft => {
            if (draft?.data) {
              draft.data = draft.data.filter(a => a.id !== agencyId);
            }
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          // Fake endpoint — swallow the error and keep the optimistic removal.
          // patchResult.undo() is intentionally NOT called here yet.
        }
      },
    }),
  }),
});

export const {
  useGetMyAgenciesQuery,
  useStoreAgencyMutation,
  useDeleteAgencyMutation,
} = managerApi;
