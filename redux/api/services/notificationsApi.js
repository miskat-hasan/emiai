// redux/api/services/notificationsApi.js
import { apiSlice } from "../apiSlice";

const NotificationsApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getNotifications: builder.query({
      query: (page = 1) => ({
        url: "/api/notifications",
        method: "GET",
        params: { page },
      }),
      providesTags: ["Notifications"],
    }),
    getUnreadNotificationCount: builder.query({
      query: () => ({ url: "/api/notifications/unread-count", method: "GET" }),
      providesTags: ["NotificationCount"],
    }),
    markNotificationsRead: builder.mutation({
      // Omit notification_id to mark all as read; pass it to mark a single one.
      query: (data = {}) => ({
        url: "/api/notifications/mark-read",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Notifications", "NotificationCount"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadNotificationCountQuery,
  useMarkNotificationsReadMutation,
} = NotificationsApi;
