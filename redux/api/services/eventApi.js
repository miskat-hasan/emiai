import { apiSlice } from "../apiSlice";

export const eventApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getUpcomingEvents: builder.query({
      query: () => ({ url: "/api/events", method: "GET" }),
      providesTags: ["Event"],
    }),

    getMyEvents: builder.query({
      query: () => ({ url: "/api/events", method: "GET" }),
      providesTags: ["Event"],
    }),

    getMyTickets: builder.query({
      query: () => ({ url: "/api/event/my-tickets", method: "GET" }),
      providesTags: ["Event"],
    }),
  }),
});

export const {
  useGetUpcomingEventsQuery,
  useGetMyEventsQuery,
  useGetMyTicketsQuery,
} = eventApi;
