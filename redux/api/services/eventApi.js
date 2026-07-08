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
      query: (data) => ({
        url: "/api/events-update",
        method: "POST",
        body: data,
      }),
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
      query: () => ({ url: "/api/events?type=upcoming", method: "GET" }),
      providesTags: ["Event"],
    }),

    getMyEvents: builder.query({
      query: () => ({ url: "/api/events?type=my", method: "GET" }),
      providesTags: ["Event"],
    }),

    getEventById: builder.query({
      query: (id) => ({ url: `/api/events-show?id=${id}`, method: "GET" }),
      providesTags: (result, error, id) => [{ type: "Event", id }],
    }),

    getMyTickets: builder.query({
      query: () => ({ url: "/api/event/my-tickets", method: "GET" }),
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
} = eventApi;
