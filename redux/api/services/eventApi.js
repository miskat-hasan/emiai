import { apiSlice } from "../apiSlice";

export const eventApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    createEvent: builder.mutation({
      query: (data) => ({ url: "/api/events-store", method: "POST", body: data }),
      invalidatesTags: ["Event"],
    }),

    getUpcomingEvents: builder.query({
      query: () => ({ url: "/api/events", method: "GET" }),
      providesTags: ["Event"],
    }),

    getMyEvents: builder.query({
      query: () => ({ url: "/api/events", method: "GET" }),
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
  }),
});

export const {
  useCreateEventMutation,
  useGetUpcomingEventsQuery,
  useGetMyEventsQuery,
  useGetEventByIdQuery,
  useGetMyTicketsQuery,
} = eventApi;
