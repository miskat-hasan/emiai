// redux/api/apiSlice.js

import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithInterceptor from "@/redux/api/baseQueryWithInterceptor";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithInterceptor,

  tagTypes: [
    "User",
    "Contest",
    "Event",
    "Ad",
    "Voucher",
    "VoucherCategory",
    "Country",
    "Categories",
    "Bookmark",
    "Countries",
    "Deals",
    "Users",
    "SocialStatus",
    "Agencies",
    "Conversation",
    "Messages",
    "AvailableUsers",
    "PinnedMessages",
    "GroupMembers",
    "Collaborators",
    "Portfolio",
    "PeerInvitations",
    "NotificationCount",
  ],

  endpoints: () => ({}),
});
