// redux/api/services/collaboratorsApi.js
import { apiSlice } from "../apiSlice";

const CollaboratorsApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getCollaborators: builder.query({
      query: () => ({
        url: "/api/events/collaborations/my",
        method: "GET",
      }),
      providesTags: ["Collaborators"],
    }),
    getMysendInvitations: builder.query({
      query: () => ({
        url: "/api/events/collaborations/sent",
        method: "GET",
      }),
      providesTags: ["Collaborators"],
    }),
    requestPayment: builder.mutation({
      query: data => ({
        url: "/api/events/invitation/request-payment",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Collaborators"],
    }),
    approvePayment: builder.mutation({
      query: data => ({
        url: "/api/events/invitation/approve-payment",
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
      query: data => ({
        url: "/api/events/collaborations/handle",
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
  useApprovePaymentMutation,
  useGetPaymentRequestedInvitationsQuery,
  useActionInvitationMutation,
} = CollaboratorsApi;
