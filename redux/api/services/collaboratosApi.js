import { apiSlice } from "../apiSlice";

const CollaboratorsApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getCollaborators: builder.query({
      query: () => ({
        url: "/api/events/my-invitations",
        method: "GET",
      }),
    }),
    getMysendInvitations: builder.query({
      query: () => ({
        url: "/api/events/my-sent-invitations",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetCollaboratorsQuery, useGetMysendInvitationsQuery } = CollaboratorsApi;
