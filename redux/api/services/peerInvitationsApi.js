// redux/api/services/peerInvitationsApi.js
import { apiSlice } from "../apiSlice";

const PeerInvitationsApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getMyInvitations: builder.query({
      query: () => ({ url: "/api/events/my-invitations", method: "GET" }),
      providesTags: ["PeerInvitations"],
    }),
    getMySentInvitations: builder.query({
      query: () => ({ url: "/api/events/my-sent-invitations", method: "GET" }),
      providesTags: ["PeerInvitations"],
    }),
    actionInvitation: builder.mutation({
      query: data => ({
        url: "/api/events/invitation/action",
        method: "POST",
        body: data, // { invitation_id, status: "accepted" | "rejected" }
      }),
      invalidatesTags: ["PeerInvitations"],
    }),
    requestInvitationPayment: builder.mutation({
      query: data => ({
        url: "/api/events/invitation/request-payment",
        method: "POST",
        body: data, // { invitation_id, amount }
      }),
      invalidatesTags: ["PeerInvitations"],
    }),
    getPaymentRequestedInvitations: builder.query({
      query: () => ({
        url: "/api/events/payment-requested-invitations",
        method: "GET",
      }),
      providesTags: ["PeerInvitations"],
    }),
    approveInvitationPayment: builder.mutation({
      query: data => ({
        url: "/api/events/invitation/approve-payment",
        method: "POST",
        body: data, // { invitation_id, action: "approved" | "rejected" }
      }),
      invalidatesTags: ["PeerInvitations"],
    }),
  }),
});

export const {
  useGetMyInvitationsQuery,
  useGetMySentInvitationsQuery,
  useActionInvitationMutation,
  useRequestInvitationPaymentMutation,
  useGetPaymentRequestedInvitationsQuery,
  useApproveInvitationPaymentMutation,
} = PeerInvitationsApi;
