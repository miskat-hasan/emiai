import { apiSlice } from "../apiSlice";

export const eventApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createEvent: builder.mutation({
      query: (data) => ({
        url: "/api/events-store",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Event"],
    }),

    updateEvent: builder.mutation({
      query: (data) => {
        const id = data instanceof FormData ? data.get("id") : data.id;
        return {
          url: `/api/update-events/${id}`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: ["Event"],
    }),

    sendEventInvitation: builder.mutation({
      query: (data) => ({
        url: "/api/events/invite",
        method: "POST",
        body: data,
      }),
    }),

    getUpcomingEvents: builder.query({
      query: (params) => ({ url: "/api/events", method: "GET", params: { type: "upcoming", ...params } }),
      providesTags: ["Event"],
    }),

    getMyEvents: builder.query({
      query: (params) => ({ url: "/api/events", method: "GET", params: { type: "my", ...params } }),
      providesTags: ["Event"],
    }),

    getEventById: builder.query({
      query: (id) => ({ url: `/api/events-show?id=${id}`, method: "GET" }),
      providesTags: (result, error, id) => [{ type: "Event", id }],
    }),

    getMyTickets: builder.query({
      query: (params) => ({ url: "/api/events/get-user-tickets", method: "GET", params }),
      providesTags: ["Event"],
    }),
    registerTicket: builder.mutation({
      query: (data) => ({
        url: "/api/register-ticket",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Event"],
    }),
    
    getMySentInvitations: builder.query({
      query: (params) => ({ url: "/api/events/my-sent-invitations", method: "GET", params }),
      providesTags: ["Event"],
    }),
    getTicketDetails: builder.query({
      query: (ticketCode) => ({ url: `/api/events/ticket-details?ticket_code=${ticketCode}`, method: "GET" }),
      providesTags: (result, error, ticketCode) => [{ type: "Event", id: ticketCode }],
    }),
  }),
});

export const {
  useCreateEventMutation,
  useUpdateEventMutation,
  useSendEventInvitationMutation,
  useGetUpcomingEventsQuery,
  useGetMyEventsQuery,
  useGetEventByIdQuery,
  useGetMyTicketsQuery,
  useRegisterTicketMutation,
  useGetMySentInvitationsQuery,
  useGetTicketDetailsQuery,
} = eventApi;
