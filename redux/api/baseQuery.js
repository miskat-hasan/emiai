// // redux/api/baseQuery.js

// import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// export const baseQuery = fetchBaseQuery({
//   baseUrl: process.env.NEXT_PUBLIC_API_URL,
//   // credentials: "include",
//   prepareHeaders: (headers, { getState }) => {
//     const token = getState().auth.token;

//     if (token) {
//       headers.set("Authorization", `Bearer ${token}`);
//     }

//     return headers;
//   },
// });

import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  prepareHeaders: (headers, { getState }) => {
    // 1. Try Redux state first (available right after login)
    const reduxToken = getState().auth?.token;

    // 2. Fall back to the cookie (survives page reloads)
    const cookieToken =
      typeof document !== "undefined"
        ? document.cookie
            .split("; ")
            .find(row => row.startsWith("token="))
            ?.split("=")[1]
        : null;

    const token = reduxToken || cookieToken;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});