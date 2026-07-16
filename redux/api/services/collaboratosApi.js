import { apiSlice } from "../apiSlice";

const CollaboratorsApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getCollaborators: builder.query({
      query: () => ({
        url: "/api/events/my-invitations",
        method: "GET",
      }),
      providesTags: ["Collaborators"],
    }),
    getMysendInvitations: builder.query({
      query: () => ({
        url: "/api/events/my-sent-invitations",
        method: "GET",
      }),
    }),
    requestPayment: builder.mutation({
      query: (data) => ({
        url: "/api/events/invitation/request-payment",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Collaborators"],
    }),
    getPaymentRequestedInvitations: builder.query({
      query: () => ({
        url: "/api/events/payment-requested-invitations",
        method: "GET",
      }),
      providesTags: ["Collaborators"],
    }),
    actionInvitation: builder.mutation({
      query: (data) => ({
        url: "/api/events/invitation/action",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Collaborators"],
    }),
  }),
});

export const { 
  useGetCollaboratorsQuery, 
  useGetMysendInvitationsQuery, 
  useRequestPaymentMutation, 
  useGetPaymentRequestedInvitationsQuery,
  useActionInvitationMutation
} = CollaboratorsApi;
